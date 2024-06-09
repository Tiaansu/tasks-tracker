'use client';

import { AppShell } from '@mantine/core';

export default function AppAppShell({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <AppShell header={{ height: 80 }} padding="md">
            {children}
        </AppShell>
    );
}
