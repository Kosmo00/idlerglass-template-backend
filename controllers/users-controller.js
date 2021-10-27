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
        return res.status(200).send(data)
    }
    static async userOrganizations(req, res) {
        const token_data = req.header('x-token')
        const token = await Cripto.getGhTokenFromJWT(token_data)
        const userOrganizations = await GhClient.getUserOrganizations(token)
        let organizations = new Array(userOrganizations.length)
        for (let i = 0; i < organizations.length; i++) {
            organizations[i] = {
                name: userOrganizations[i].login,
                description: userOrganizations[i].description
            }
        }
        return res.status(200).send(organizations)
    }
}