const {sign, verify} = require('jsonwebtoken')

async function createAccessToken(userId, claims) {
	return sign({
		userId,
		claims,
		expiresIn: Math.floor(Date.now() / 1000) + 20
	}, process.env.ACCESS_TOKEN_SECRET)
}

async function createRefreshToken(password, refreshCode) {
	console.log(`${process.env.REFRESH_TOKEN_SECRET}${password}${refreshCode}`)
	return sign({
		expiresIn: Math.floor(Date.now() / 1000) + 20
	}, `${process.env.REFRESH_TOKEN_SECRET}${password}${refreshCode}`)
}

async function checkAccess(accessToken) {

	try {
		var decoded = verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
	} catch(err) {
		return {err: `accesstoken error, ${err}`}
	}
	console.log(Math.floor(Date.now() / 1000))

	if(decoded.expiresIn < Math.floor(Date.now() / 1000)) {
		return {
			userId: decoded.userId,
			expired: true
		} 
	}

	return decoded
}

async function checkRefresh(refreshtoken, refreshCode, password) {
	try {
		var decoded = verify(refreshtoken, `${process.env.REFRESH_TOKEN_SECRET}${password}${refreshCode}`)
	} catch(err) {
		console.log(`${process.env.REFRESH_TOKEN_SECRET}${password}${refreshCode}`)
		return {err: `refreshtoken error, ${err}`}
	}
	console.log(Math.floor(Date.now() / 1000))

	if(decoded.expiresIn < Math.floor(Date.now() / 1000)) {
		// fix return an error instead
		return {
			userId: decoded.userId,
			expired: true
		} 
	}

	return decoded
}

module.exports = {createAccessToken, createRefreshToken, checkAccess, checkRefresh}