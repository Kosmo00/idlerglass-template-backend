const GhClient = require('../services/endpoints/api-github')
const Cripto = require('../services/crypto')

module.exports = class UsersController {
    static async loginUser(req, res) {
        const { code } = req.query
        const token_data = await GhClient.getToken(code)
        if (token_data.error) {
            return res.status(403).send({ message: token_data.error_description })
        }
        const token = token_data.access_token
        const userData = await GhClient.getUserInfo(token)
        const remember_token = await Cripto.generateWebToken(userData.loginUser, token)
        const data = {
            user: {
                username: userData.login,
                avatar: userData.avatar_url
            }
        }
        return res.status(200).header('x-token', remember_token).send(data)
    }
}