'use client';

import {
    Anchor,
    AppShellHeader,
    Avatar,
    Group,
    Menu,
    rem,
    Skeleton,
    Title,
} from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';

export default function Navbar() {
    const session = useSession();
    const user = session.data?.user;

    return (
        <AppShellHeader py="lg" px="xl">
            <Group justify="space-between">
                <Anchor href="/~" underline="never" c="yellow">
                    <Title order={3}>Tasks Tracker</Title>
                </Anchor>

                {/* Render if the session data is still loading */}
                {!user && session.status === 'loading' && (
                    <Skeleton height={40} circle />
                )}

                {/* Render if there's a session */}
                {user && (
                    <Menu
                        shadow="md"
                        radius="lg"
                        width={200}
                        position="bottom-end"
                    >
                        <Menu.Target>
                            {!user.image ? (
                                <Avatar
                                    radius="xl"
                                    color="yellow"
                                    src={user.image}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {user.name}
                                </Avatar>
                            ) : (
                                <Avatar
                                    radius="xl"
                                    alt={`${user.name}'s profile`}
                                    src={user.image}
                                    style={{ cursor: 'pointer' }}
                                />
                            )}
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item
                                color="red"
                                onClick={() => signOut({ callbackUrl: '/' })}
                                leftSection={
                                    <IconLogout
                                        style={{
                                            width: rem(16),
                                            height: rem(16),
                                        }}
                                    />
                                }
                            >
                                Sign out
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                )}
            </Group>
        </AppShellHeader>
    );
}
