import React from 'react';
import { requireRole } from '@/lib/server';

const AdminDashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    await requireRole('admin');
    return children;
};

export default AdminDashboardLayout;