import express from 'express';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createServer } from 'http';
import { expressMiddleware } from '@apollo/server/express4';
import gql from 'graphql-tag';

// Construct a schema, using GraphQL schema language
const typeDefs = gql`#graphql
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
    
  },
};

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = createServer(app);

  // Use express.json() middleware to parse JSON requests
  app.use(express.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  app.use('/graphql',expressMiddleware(server));

  httpServer.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000`);
  });
}

startApolloServer(typeDefs, resolvers);