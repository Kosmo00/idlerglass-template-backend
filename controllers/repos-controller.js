const GhClient = require('../services/endpoints/api-github')
const Cripto = require('../services/crypto')

module.exports = class ReposController {

    static async organizationRepoData(req, res) {
        const token_data = req.header('x-token')
        const { organization, repo } = req.params
        const token = await Cripto.getGhTokenFromJWT(token_data)
        const organizationRepoData = await GhClient.getOrganizationRepo(token, organization, repo)
        console.log(organizationRepoData)
        res.status(200).send(organizationRepoData)
    }
}