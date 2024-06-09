import getSession from '@/lib/getSession';
import HomePage from './HomePage';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function Page() {
    const session = await getSession();
    const user = session?.user;

    if (!user) {
        redirect('/sign-in');
    }

    const tasks = await prisma.tasks.findMany({
        where: { userId: session.user.id },
    });

    return <HomePage user={user} tasks={tasks} />;
}
