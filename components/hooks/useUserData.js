"use client";

import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [authDate, setAuthDate] = useState(null); // Add state for auth_date
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      WebApp.ready(); // Ensure WebApp is ready

      setLoading(false);

      if (WebApp.initDataUnsafe) {
        const { user, auth_date } = WebApp.initDataUnsafe; // Destructure auth_date
        setUserData(user || null);
        setAuthDate(auth_date || null); // Set auth_date
      }
    }
  }, []);

  return { userData, authDate, loading }; // Return authDate as well
};

export default useUserData;
