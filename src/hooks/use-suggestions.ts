import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Suggestion } from '@/lib/menu-api-contract';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export function useSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<Suggestion[]>(`${API_URL}/menu/suggestions`);
        setSuggestions(res.data);
      } catch (err) {
        console.error('[useSuggestions]: Failed to fetch suggestions', err);
        setSuggestions([]);
        setError('Could not load smart suggestions.');
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, []);

  return { suggestions, loading, error };
}
