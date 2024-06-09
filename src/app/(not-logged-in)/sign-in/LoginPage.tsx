'use client';

import { signIn } from 'next-auth/react';

export default function LoginPage({ callbackUrl }: { callbackUrl: string }) {
    signIn('google', { redirect: true, callbackUrl: callbackUrl ?? '/~' });
    return <></>;
}
