const { ApolloServer } = require('apollo-server');

const typeDefs = require('./src/typeDefs');
const resolvers = require('./src/resolvers');

const server = new ApolloServer({ typeDefs, resolvers, 
  context: ({req}) => {
    return req.headers
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});