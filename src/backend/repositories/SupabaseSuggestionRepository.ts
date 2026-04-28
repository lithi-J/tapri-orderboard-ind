import { Pool } from 'pg';
import { SuggestionRepository, Suggestion } from './MenuRepository';

export class SupabaseSuggestionRepository implements SuggestionRepository {
  constructor(private pool: Pool) {}

  async getAll(): Promise<Suggestion[]> {
    try {
      const result = await this.pool.query('SELECT * FROM suggestions');
      if (result.rows.length === 0) {
        return [];
      }
      return result.rows.map(row => ({
        group: row.group_name,
        items: row.items_text,
        presetItems: row.preset_items,
      }));
    } catch (error) {
      console.error('[SuggestionRepository]: Error fetching suggestions:', error);
      return [];
    }
  }
}
