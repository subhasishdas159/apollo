const { ApolloServer } = require('apollo-server');
const { MongoClient } = require('mongodb')

require('dotenv/config')

const client = new MongoClient('mongodb://localhost:27017/xyforums', { useUnifiedTopology: true })
client.connect()

const typeDefs = require('./src/typeDefs.graphql');
const resolvers = require('./src/resolvers');

const Users = require('./dataSources/users')

const UpperCaseDirective = require('./directives/upper')
const ReplaceCaseDirective = require('./directives/replace')
const HasScopeCaseDirective = require('./directives/hasScope')

const server = new ApolloServer({ 
	typeDefs, 
	resolvers, 
  context: ({req}) => {
    return {
    	token: req.headers.authorizarion
    }
  },
  dataSources: () => ({
    users: new Users(client.db().collection('posts'))
  }),
  schemaDirectives: {
    upper: UpperCaseDirective,
    replace: ReplaceCaseDirective,
    hasScope: HasScopeCaseDirective
  }
});

server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});