'use client';
import { CompanyManager } from '@/components/body/distributor/manager_company/CompanyManager';
import React, { useEffect, useState } from 'react';

const ManagerCompanyPageClient = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadToken = () => {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('accessToken='))
        ?.split('=')[1];
      if (isMounted) setAccessToken(token || null);
    };

    loadToken();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!accessToken) return <p>Loading or not logged in...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Manager Company Dashboard</h1>
      <CompanyManager accessToken={accessToken} companyId={null} />
    </div>
  );
};

export default ManagerCompanyPageClient;
