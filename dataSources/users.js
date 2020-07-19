const { MongoDataSource } = require('apollo-datasource-mongodb')
const {hashIt, compareIt} = require('../utilities/hash')
const {createAccessToken, createRefreshToken, checkAccess} = require('../utilities/token')
var { ObjectId } = require('mongodb')

class Users extends MongoDataSource {

	async readUser(userId) {
    return this.collection.findOne({"_id": ObjectId(userId)})
  }

	async getAllUsers() {
		let allItems = []

		await this.collection.find().forEach(function(item) {
			const {name, email} = item
			allItems.push({name, email})
		})

		return allItems
	}

  async createUser(name, email, password) {
  	// console.log(this.context.token)
		if(await this.collection.findOne({ email: email })) {
			throw Error("You have already signed up before, please login")
		} else {
  		var hashedPassword = await hashIt(password)
			let result = await this.collection.insertOne( { profile: {name}, email: email, password: hashedPassword, admin: {
					refreshCode: Math.floor(Math.random() * Math.floor(10000)),
					claims: ["viewUsers", "deleteUsers"]
				} 
			} )
			console.log(result.ops[0])
			return {
				name: result.ops[0].profile.name,
				_id: result.ops[0]._id,
				accessToken: createAccessToken(result.ops[0]._id, result.ops[0].admin.claims),
				refreshToken: createRefreshToken(result.ops[0].password, result.ops[0].admin.refreshCode),
				email: result.ops[0].email
			}
		}
  }

  async loginUser(email, password) {
  	var user = await this.collection.findOne({ email: email })
  	if(!await user) {
			throw Error("The provided email was not found")
		} else {
			const passwordMatched = await compareIt(password, user.password)
			if(!passwordMatched) {
				throw Error("The password entered is incorrect")
			} else {
				return {
					name: user.profile.name,
					_id: user._id,
					accessToken: createAccessToken(user._id, user.admin.claims),
					refreshToken: createRefreshToken(user.password, user.admin.refreshCode),
					email: user.email
				}
			}
		}
  }

}


module.exports = Users
