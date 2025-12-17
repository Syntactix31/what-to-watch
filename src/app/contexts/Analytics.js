"use client";

import { useEffect } from 'react';
import { getAnalytics, isSupported } from "firebase/analytics";
import { app } from '../app/utils/firebase';

export const Analytics = () => {
  useEffect(() => {
    isSupported().then((supported) => {
      if (supported) getAnalytics(app);
    });
  }, []);
};

