const resolvers = {
  
  Query: {
    hi: () => {
      return {
        name: "helo helo"
      }
    },
    getAllUsers: async (_, __, {dataSources}) => {
    	return await dataSources.usersApi.getAllUsers()
    },
    refreshToken: async (_, __, {dataSources}) => {
      return await dataSources.usersApi.refreshToken()
    }
  },

  Mutation: {
  	createUser: async (_, {name, email, password}, {dataSources}) => {
  		return await dataSources.usersApi.createUser(name, email, password)
  	},
  	loginUser: async (_, {email, password}, {dataSources}) => {
  		return await dataSources.usersApi.loginUser(email, password)
  	}
  }

};

module.exports = resolvers