'use client';

import FacultyForm from '@/components/FacultyForm';
import { useAuth } from '@/providers/authProvider';
import LoginPage from './auth/page';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      redirect('/auth');
    }
  }, [accessToken]);
  return accessToken ? <FacultyForm /> : <LoginPage />;
}
