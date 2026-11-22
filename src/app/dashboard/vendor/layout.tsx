import React from 'react';
import { requireRole } from '@/lib/server';

const VendorDashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    await requireRole('vendor');
    return children;
};

export default VendorDashboardLayout;