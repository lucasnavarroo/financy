import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

export const APP_SECRET = process.env.JWT_SECRET || 'fallback-secret';

const prisma = new PrismaClient();

export interface AuthContext {
    userId?: string;
    prisma: PrismaClient;
}

export function getUserId(req: any): string | undefined {
    if (req) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            if (!token) {
                return undefined;
            }
            try {
                const payload = jwt.verify(token, APP_SECRET) as { userId: string };
                return payload.userId;
            } catch (err) {
                return undefined;
            }
        }
    }
    return undefined;
}

export const context = async ({ req }: any): Promise<AuthContext> => {
    return {
        userId: getUserId(req),
        prisma,
    };
};
