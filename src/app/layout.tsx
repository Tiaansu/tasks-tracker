import '@mantine/core/styles.css';
import type { Metadata } from 'next';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { theme } from '@/theme';
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
    title: {
        template: '%s - Tasks Tracker',
        absolute: 'Tasks Tracker',
    },
    description: 'A very simple tasks tracker.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <ColorSchemeScript />
            </head>
            <body>
                <SessionProvider>
                    <MantineProvider theme={theme} defaultColorScheme="dark">
                        <ModalsProvider>{children}</ModalsProvider>
                    </MantineProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
