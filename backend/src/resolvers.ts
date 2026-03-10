import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthContext, APP_SECRET } from './auth';

export const resolvers = {
    Query: {
        me: async (_parent: any, _args: any, context: AuthContext) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            return context.prisma.user.findUnique({
                where: { id: context.userId },
            });
        },
        categories: async (_parent: any, _args: any, context: AuthContext) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            return context.prisma.category.findMany({
                where: { userId: context.userId },
            });
        },
        category: async (_parent: any, { id }: { id: string }, context: AuthContext) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            const category = await context.prisma.category.findUnique({
                where: { id },
            });
            if (category && category.userId !== context.userId) {
                throw new Error('Not authorized to access this category');
            }
            return category;
        },
        transactions: async (_parent: any, _args: any, context: AuthContext) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            return context.prisma.transaction.findMany({
                where: { userId: context.userId },
            });
        },
        transaction: async (_parent: any, { id }: { id: string }, context: AuthContext) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            const transaction = await context.prisma.transaction.findUnique({
                where: { id },
            });
            if (transaction && transaction.userId !== context.userId) {
                throw new Error('Not authorized to access this transaction');
            }
            return transaction;
        },
    },
    Mutation: {
        register: async (_parent: any, args: any, context: AuthContext) => {
            const password = await bcrypt.hash(args.password, 10);
            const user = await context.prisma.user.create({
                data: { ...args, password },
            });
            const token = jwt.sign({ userId: user.id }, APP_SECRET);
            return { token, user };
        },
        login: async (_parent: any, args: any, context: AuthContext) => {
            const user = await context.prisma.user.findUnique({
                where: { email: args.email },
            });
            if (!user) {
                throw new Error('No such user found');
            }
            const valid = await bcrypt.compare(args.password, user.password);
            if (!valid) {
                throw new Error('Invalid password');
            }
            const token = jwt.sign({ userId: user.id }, APP_SECRET);
            return { token, user };
        },
        createCategory: async (_parent: any, args: any, context: AuthContext) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            return context.prisma.category.create({
                data: {
                    name: args.name,
                    description: args.description,
                    icon: args.icon,
                    color: args.color,
                    userId: context.userId,
                },
            });
        },
        updateCategory: async (_parent: any, args: any, context: AuthContext) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            const category = await context.prisma.category.findUnique({
                where: { id: args.id }
            });
            if (!category || category.userId !== context.userId) {
                throw new Error('Not authorized to update this category');
            }

            const { id, ...data } = args;

            return context.prisma.category.update({
                where: { id: args.id },
                data,
            });
        },
        deleteCategory: async (_parent: any, args: any, context: AuthContext) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            const category = await context.prisma.category.findUnique({
                where: { id: args.id }
            });
            if (!category || category.userId !== context.userId) {
                throw new Error('Not authorized to delete this category');
            }
            return context.prisma.category.delete({
                where: { id: args.id },
            });
        },
        createTransaction: async (_parent: any, args: any, context: AuthContext) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }

            const category = await context.prisma.category.findUnique({
                where: { id: args.categoryId }
            });
            if (!category || category.userId !== context.userId) {
                throw new Error('Category not found or you are not authorized');
            }

            return context.prisma.transaction.create({
                data: {
                    title: args.title,
                    amount: args.amount,
                    type: args.type,
                    categoryId: args.categoryId,
                    userId: context.userId,
                },
            });
        },
        updateTransaction: async (_parent: any, args: any, context: AuthContext) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            const transaction = await context.prisma.transaction.findUnique({
                where: { id: args.id }
            });
            if (!transaction || transaction.userId !== context.userId) {
                throw new Error('Not authorized to update this transaction');
            }

            const { id, ...data } = args;

            if (data.categoryId) {
                const category = await context.prisma.category.findUnique({
                    where: { id: data.categoryId }
                });
                if (!category || category.userId !== context.userId) {
                    throw new Error('Category not found or you are not authorized');
                }
            }

            return context.prisma.transaction.update({
                where: { id: args.id },
                data,
            });
        },
        deleteTransaction: async (_parent: any, args: any, context: AuthContext) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            const transaction = await context.prisma.transaction.findUnique({
                where: { id: args.id }
            });
            if (!transaction || transaction.userId !== context.userId) {
                throw new Error('Not authorized to delete this transaction');
            }
            return context.prisma.transaction.delete({
                where: { id: args.id },
            });
        },
    },
    User: {
        categories: async (parent: any, _args: any, context: AuthContext) => {
            return context.prisma.category.findMany({
                where: { userId: parent.id },
            });
        },
        transactions: async (parent: any, _args: any, context: AuthContext) => {
            return context.prisma.transaction.findMany({
                where: { userId: parent.id },
            });
        },
    },
    Category: {
        user: async (parent: any, _args: any, context: AuthContext) => {
            return context.prisma.user.findUnique({
                where: { id: parent.userId },
            });
        },
        transactions: async (parent: any, _args: any, context: AuthContext) => {
            return context.prisma.transaction.findMany({
                where: { categoryId: parent.id },
            });
        },
    },
    Transaction: {
        user: async (parent: any, _args: any, context: AuthContext) => {
            return context.prisma.user.findUnique({
                where: { id: parent.userId },
            });
        },
        category: async (parent: any, _args: any, context: AuthContext) => {
            return context.prisma.category.findUnique({
                where: { id: parent.categoryId },
            });
        },
    },
};
