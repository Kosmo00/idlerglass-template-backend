const jwt = require('jsonwebtoken')

module.exports = class Crypto {
    static async generateWebToken(login, ghToken) {
        const token_data = {
            login,
            token: ghToken
        }
        const remember_token = await jwt.sign(token_data, process.env.SECRET)
        return remember_token
    }
    static async getGhTokenFromJWT(remember_token) {
        const decode = jwt.verify(remember_token, process.env.SECRET)
        return decode.token
    }
}