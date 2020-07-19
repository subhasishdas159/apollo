const { SchemaDirectiveVisitor } = require('apollo-server');

const {createAccessToken, createRefreshToken, checkAccess, checkRefresh} = require('../utilities/token')

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const { requires } = this.args

    field.resolve = async function (...args) {
      console.log(requires)
      //todo handle no tokens being provided
      const {accessToken, refreshToken, dataSources} = args[2]
      const checkedValue = await checkAccess(accessToken)

      if(checkedValue.err) {
        throw Error(checkedValue.err)
      }

      console.log(checkedValue)
      console.log(Math.floor(Date.now() / 1000))
      const {userId} = checkedValue

      if(checkedValue.expired) {
        // fix foundUser returns undefined
        const foundUser = await dataSources.usersApi.readUser(userId)

        console.log(123, foundUser)

        const claimsFromDb = foundUser.admin.claims
        const refreshCode = foundUser.admin.refreshCode
        const passwordFromDb = foundUser.password

        const checkRefreshResult = await checkRefresh(refreshToken, refreshCode, passwordFromDb)
        console.log(checkRefreshResult)

        if(checkRefreshResult.err) {
          throw Error(checkRefreshResult.err)
        }

        if(checkRefreshResult.expired) {
          throw Error("Refresh token has expired. Please login again")
        }

        const newAccessToken = await createAccessToken(userId, claimsFromDb)
        const newRefreshToken = await createRefreshToken(passwordFromDb, refreshCode)

        console.log("new token sending")
        
        return {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        }
      }

      const {claims} = checkedValue


      if(requires) {
        if(!claims.includes(requires)) {
          console.log("requires")
          console.log(claims)
          throw Error("You don't have the required privileges")
        } else {
          console.log("requires else")
          return resolve.apply(this, args)
        }
      } else {
        console.log("not requires")
        return resolve.apply(this, args)
      }
      
    };

  }
}

module.exports = AuthDirective