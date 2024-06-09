import AppAppShell from '@/components/AppShell/AppAppShell';
import Navbar from '@/components/Navbar/Navbar';

export default function HomeLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <AppAppShell>
            <Navbar />
            {children}
        </AppAppShell>
    );
}
