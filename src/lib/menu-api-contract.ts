/**
 * Shared API contracts for menu endpoints (frontend + backend).
 * Keep in sync with `src/backend/routes/menuRoutes.ts` validation rules.
 */

/** Flat menu row returned by `GET /api/menu` (ordering UI). */
export type MenuItem = {
  id: string;
  name: string;
  emoji: string;
  price: number;
  category: 'tea' | 'snack' | 'beverage' | 'coldrink';
};

export interface Suggestion {
  group: string;
  items: string;
  presetItems: { id: string; qty: number }[];
}

export type MenuTagType = 'bestseller' | 'new' | 'hot' | 'cold';

export interface MenuCardTag {
  type: MenuTagType;
  label: string;
}

export interface MenuCardItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  tags: MenuCardTag[];
}

export interface MenuCategory {
  id: string;
  title: string;
  items: MenuCardItem[];
}

export interface CreateMenuCardItemInput {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  tags?: MenuCardTag[];
}

export interface UpdateMenuCardItemInput {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  tags?: MenuCardTag[];
}
