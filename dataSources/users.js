const { MongoDataSource } = require('apollo-datasource-mongodb')

class Users extends MongoDataSource {
  getUser(userId) {
  	// console.log(userId)
  	// console.log(this)
    return this.findOneById(userId)
  }
  updateUserName(userId, newName) {
    this.deleteFromCacheById(userId)
    return this.collection.updateOne({ 
      _id: userId 
    }, {
      $set: { postName: newName }
    })
  }
}

module.exports = Users