const POST_ADDED = 'POST_ADDED';
const { PubSub } = require('apollo-server');

const pubsub = new PubSub();

const resolvers = {
  Subscription: {
    postAdded: {
      subscribe: () => pubsub.asyncIterator([POST_ADDED]),
    },
  },
  Query: {
    async posts(root, args, {dataSources}) {
      // return await dataSources.users.getUser("5f085417004bc39100aae0b6");
      return await dataSources.users.updateUserName("5f085417004bc39100aae0b6", "from backend dataSources");
    },
    hello: () => ("hello planet"),
    hey: () => ("hey okay"),
    hi: () => ("hi okay with scope")
  },
  Mutation: {
    addPost(root, args, context) {
      pubsub.publish(POST_ADDED, { postAdded: args });
      return postController.addPost(args);
    },
  },

  k: {
    value: () => ("hello k")
  }
};

const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

module.exports = resolvers