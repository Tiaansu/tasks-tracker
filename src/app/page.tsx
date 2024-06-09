import getSession from '@/lib/getSession';
import { redirect } from 'next/navigation';

export default async function Home() {
    const session = await getSession();
    const user = session?.user;

    if (user) {
        redirect('/~');
    }

    redirect('/sign-in?callbackUrl=/~');
}
