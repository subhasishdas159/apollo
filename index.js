const { ApolloServer } = require('apollo-server');
const { MongoClient } = require('mongodb')

require('dotenv/config')

const client = new MongoClient('mongodb://localhost:27017/pizza', { useUnifiedTopology: true })
client.connect()

const typeDefs = require('./src/typeDefs.graphql');
const resolvers = require('./src/resolvers');

const Users = require('./dataSources/users')

const AuthDirective = require('./directives/auth')

const server = new ApolloServer({ 
	typeDefs, 
	resolvers,
	context: ({req}) => {
    return {
      _id: req.headers._id,
    	accessToken: req.headers.access,
      refreshToken: req.headers.refresh
    }
  },
  dataSources: () => ({
    usersApi: new Users(client.db().collection('users'))
  }),
  schemaDirectives: {
    auth: AuthDirective
  }
});

server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});