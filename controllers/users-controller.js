const GhClient = require('../services/endpoints/api-github')
const Cripto = require('../services/crypto')

module.exports = class UsersController {
    static async loginUser(req, res) {
        const { code } = req.body
        const token_data = await GhClient.getToken(code)
        if (token_data.error) {
            return res.status(401).send({ message: token_data.error_description })
        }
        const token = token_data.access_token
        const userData = await GhClient.getUserInfo(token)
        const remember_token = await Cripto.generateWebToken(userData.loginUser, token)
        const data = {
            user: {
                username: userData.login,
                avatar: userData.avatar_url,
                token: remember_token
            }
        }
        //console.log(data.user)
        return res.status(200).send(data)
    }
}