const {hash, compare} = require('bcrypt')

async function hashIt(password) {
	try{
		const hashedPassword = await hash(password, 10)
		return hashedPassword
	} catch(err) {
		throw Error("Hashing error",err)
	}
}

async function compareIt(password, hashedPassword) {
	try{
		const matched = compare(password, hashedPassword)
		return matched
	} catch(err) {
		throw Error("Hashing error",err)
	}
}

module.exports = {hashIt, compareIt}