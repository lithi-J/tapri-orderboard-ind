import type {
  CreateMenuCardItemInput,
  MenuCardItem,
  MenuCategory,
  MenuItem,
  Suggestion,
  UpdateMenuCardItemInput,
} from '../../lib/menu-api-contract';

export type {
  CreateMenuCardItemInput,
  MenuCardItem,
  MenuCardTag,
  MenuCategory,
  MenuItem,
  MenuTagType,
  Suggestion,
  UpdateMenuCardItemInput,
} from '../../lib/menu-api-contract';

export interface MenuRepository {
  getAll(): Promise<MenuItem[]>;
  getMenuCard(): Promise<MenuCategory[]>;
  createMenuCardItem(input: CreateMenuCardItemInput): Promise<MenuCardItem>;
  updateMenuCardItem(itemId: string, input: UpdateMenuCardItemInput): Promise<MenuCardItem | null>;
  deleteMenuCardItem(itemId: string): Promise<boolean>;
}

export interface SuggestionRepository {
  getAll(): Promise<Suggestion[]>;
}
