import { useState, useEffect } from 'react';

const useStateHydration = (key, initialState) => {
  // Initialize state with a function to avoid unnecessary localStorage access
  const [state, setState] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialState;
    } catch (error) {
      console.error('Error hydrating state:', error);
      return initialState;
    }
  });

  // Persist state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error('Error persisting state:', error);
    }
  }, [key, state]);

  return [state, setState];
};

export default useStateHydration; 