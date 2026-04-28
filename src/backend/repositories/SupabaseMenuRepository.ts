import { randomUUID } from 'crypto';
import { Pool } from 'pg';
import type { MenuItem } from '../../lib/menu-api-contract';
import {
  CreateMenuCardItemInput,
  MenuCardItem,
  MenuCardTag,
  MenuCategory,
  MenuRepository,
  UpdateMenuCardItemInput,
} from './MenuRepository';

const CATEGORY_TITLES: Record<string, string> = {
  'hot-teas': 'HOT TEAS',
  'milk-drinks': 'MILK DRINKS',
  'cold-drinks': 'COLD DRINKS',
  snacks: 'SNACKS',
};

const LEGACY_CATEGORY_MAP: Record<string, MenuItem['category']> = {
  'hot-teas': 'tea',
  'milk-drinks': 'beverage',
  snacks: 'snack',
  'cold-drinks': 'coldrink',
};

const LEGACY_EMOJI_MAP: Record<string, string> = {
  'hot-teas': '☕',
  'milk-drinks': '🥛',
  snacks: '🥟',
  'cold-drinks': '🥤',
};

type MenuItemRow = {
  id: string;
  name: string;
  description: string | null;
  emoji: string | null;
  price: string | number;
  category: string;
  tags: MenuCardTag[] | null;
};

function normalizeTags(tags: unknown): MenuCardTag[] {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .filter((tag): tag is { type: string; label: string } => {
      return Boolean(tag && typeof tag === 'object' && 'type' in tag && 'label' in tag);
    })
    .map(tag => ({ type: tag.type as MenuCardTag['type'], label: String(tag.label) }));
}

function mapRowToMenuCardItem(row: MenuItemRow): MenuCardItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    price: Number(row.price),
    categoryId: row.category,
    tags: normalizeTags(row.tags),
  };
}

function toLegacyCategory(categoryId: string): MenuItem['category'] {
  return LEGACY_CATEGORY_MAP[categoryId] ?? 'beverage';
}

function inferCategoryId(name: string, fallbackCategoryId: string): string {
  const normalized = name.trim().toLowerCase();

  const snacksKeywords = [
    'samosa',
    'kachori',
    'vada',
    'pav',
    'biscuit',
    'cookie',
    'rusk',
    'maggi',
    'bun',
    'bread',
    'omelette',
    'sandwich',
    'toast',
    'fries',
  ];
  const milkDrinkKeywords = [
    'milk',
    'coffee',
    'boost',
    'horlicks',
    'bournvita',
    'badam',
    'rose',
    'shake',
  ];
  const coldDrinkKeywords = [
    'cold coffee',
    'cold',
    'iced',
    'ice tea',
    'lassi',
    'juice',
    'soda',
    'sprite',
    'coke',
    'cola',
    'pepsi',
    'nimbu',
    'lemonade',
    'mojito',
  ];
  const teaKeywords = [
    'chai',
    'tea',
    'masala',
    'ginger',
    'elaichi',
    'green tea',
    'black tea',
    'sulaimani',
    'kulhad',
    'lemon tea',
  ];

  if (snacksKeywords.some(keyword => normalized.includes(keyword))) {
    return 'snacks';
  }

  if (coldDrinkKeywords.some(keyword => normalized.includes(keyword))) {
    return 'cold-drinks';
  }

  if (milkDrinkKeywords.some(keyword => normalized.includes(keyword))) {
    return 'milk-drinks';
  }

  if (teaKeywords.some(keyword => normalized.includes(keyword))) {
    return 'hot-teas';
  }

  return fallbackCategoryId;
}

export class SupabaseMenuRepository implements MenuRepository {
  constructor(private pool: Pool) {}

  async getAll(): Promise<MenuItem[]> {
    try {
      const result = await this.pool.query<MenuItemRow>('SELECT * FROM menu_items ORDER BY category, name');
      if (result.rows.length === 0) {
        return [];
      }
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        emoji: row.emoji ?? LEGACY_EMOJI_MAP[row.category] ?? '☕',
        price: Number(row.price),
        category: toLegacyCategory(row.category),
      }));
    } catch (error) {
      console.error('[MenuRepository]: Error fetching menu:', error);
      return [];
    }
  }

  async getMenuCard(): Promise<MenuCategory[]> {
    try {
      const result = await this.pool.query<MenuItemRow>(
        'SELECT id, name, description, emoji, price, category, tags FROM menu_items ORDER BY category, name'
      );

      if (result.rows.length === 0) {
        return [];
      }

      const grouped = new Map<string, MenuCategory>();

      for (const row of result.rows) {
        const categoryId = row.category;
        if (!grouped.has(categoryId)) {
          grouped.set(categoryId, {
            id: categoryId,
            title: CATEGORY_TITLES[categoryId] ?? categoryId.replace(/-/g, ' ').toUpperCase(),
            items: [],
          });
        }
        grouped.get(categoryId)!.items.push(mapRowToMenuCardItem(row));
      }

      return Array.from(grouped.values());
    } catch (error) {
      console.error('[MenuRepository]: Error fetching menu card data:', error);
      return [];
    }
  }

  async createMenuCardItem(input: CreateMenuCardItemInput): Promise<MenuCardItem> {
    const id = randomUUID();
    const categoryId = inferCategoryId(input.name, input.categoryId);
    const result = await this.pool.query<MenuItemRow>(
      `INSERT INTO menu_items (id, name, description, price, category, emoji, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
       RETURNING id, name, description, emoji, price, category, tags`,
      [id, input.name, input.description, input.price, categoryId, null, JSON.stringify(input.tags ?? [])]
    );

    return mapRowToMenuCardItem(result.rows[0]);
  }

  async updateMenuCardItem(itemId: string, input: UpdateMenuCardItemInput): Promise<MenuCardItem | null> {
    const existing = await this.pool.query<MenuItemRow>(
      'SELECT id, name, description, emoji, price, category, tags FROM menu_items WHERE id = $1',
      [itemId]
    );

    if (existing.rows.length === 0) {
      return null;
    }

    const current = existing.rows[0];
    const nextName = input.name ?? current.name;
    const nextCategoryId = inferCategoryId(nextName, input.categoryId ?? current.category);
    const result = await this.pool.query<MenuItemRow>(
      `UPDATE menu_items
       SET name = $2,
           description = $3,
           price = $4,
           category = $5,
           tags = $6::jsonb
       WHERE id = $1
       RETURNING id, name, description, emoji, price, category, tags`,
      [
        itemId,
        nextName,
        input.description ?? current.description ?? '',
        input.price ?? Number(current.price),
        nextCategoryId,
        JSON.stringify(input.tags ?? normalizeTags(current.tags)),
      ]
    );

    return mapRowToMenuCardItem(result.rows[0]);
  }

  async deleteMenuCardItem(itemId: string): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM menu_items WHERE id = $1', [itemId]);
    return (result.rowCount ?? 0) > 0;
  }
}
