import { useState, useEffect } from 'react';
import axios from 'axios';
import type { MenuItem } from '@/lib/menu-api-contract';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export function useMenu() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<MenuItem[]>(`${API_URL}/menu`);
        setMenu(res.data);
      } catch (err) {
        console.error('[useMenu]: Failed to fetch menu', err);
        setMenu([]);
        setError('Could not load menu. Check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  return { menu, loading, error };
}
