import { type Metadata } from 'next';
import getSession from '@/lib/getSession';
import LoginPage from './LoginPage';
import { redirect } from 'next/navigation';
import { Center, Loader, Text } from '@mantine/core';

export const metadata: Metadata = {
    title: 'Sign In',
};

export default async function Page({
    searchParams,
}: {
    searchParams: {
        callbackUrl: string;
    };
}) {
    const session = await getSession();
    const user = session?.user;

    if (user) {
        redirect(searchParams.callbackUrl ?? '/~');
    }

    return (
        <>
            <Center h="95vh">
                <Loader color="yellow" />
                <Text>&nbsp;Verifying your session...</Text>
            </Center>
            <LoginPage callbackUrl={searchParams.callbackUrl ?? '/~'} />
        </>
    );
}
