import prisma from '@/lib/prisma';

export const GET = async (req: Request, { id }: { id: string }) => {
    try {
        const data = await prisma.tasks.findMany({
            where: {
                id,
            },
            take: 100,
        });

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'An unknown error occurred' }),
            {
                status: 500,
            }
        );
    }
};
