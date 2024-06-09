'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addTask(
    id: string,
    title: string,
    description: string,
    tags: string[],
    priority: string | number
) {
    await prisma.tasks.create({
        data: {
            title,
            description,
            tags: tags ?? [],
            priority:
                typeof priority === 'string' ? parseInt(priority) ?? 0 : 0,
            userId: id,
        },
    });

    revalidatePath('/~');
}

export async function deleteTask(id: string) {
    await prisma.tasks.delete({ where: { id } });

    revalidatePath('/~');
}

export async function updateTask(
    id: string,
    taskId: string,
    title: string,
    description: string,
    tags: string[],
    status: string | number,
    priority: string | number
) {
    await prisma.tasks.update({
        data: {
            title,
            description,
            tags: tags ?? [],
            status: typeof status === 'string' ? parseInt(status) ?? 1 : 1,
            priority:
                typeof priority === 'string' ? parseInt(priority) ?? 0 : 0,
            userId: id,
        },
        where: {
            id: taskId,
        },
    });

    revalidatePath('/~');
}
