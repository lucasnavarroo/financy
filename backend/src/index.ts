import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { context, AuthContext } from './auth';

async function startServer() {
    const server = new ApolloServer<AuthContext>({
        typeDefs,
        resolvers,
    });

    const { url } = await startStandaloneServer(server, {
        context: async ({ req }) => await context({ req }),
        listen: { port: 4000 },
    });

    console.log(`🚀 Server ready at: ${url}`);
}

startServer().catch((error) => console.error(error));
