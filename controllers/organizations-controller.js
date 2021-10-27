const GhClient = require('../services/endpoints/api-github')
const Cripto = require('../services/crypto/index')

module.exports = class OrganizationsController {
    static async organizationRepos(req, res) {
        const token_data = req.header('x-token')
        const { organization } = req.params
        const token = await Cripto.getGhTokenFromJWT(token_data)
        const organizationRepos = await GhClient.getOrganizationRepos(token, organization)
        let repos = new Array(organizationRepos.length)
        for (let i = 0; i < repos.length; i++) {
            repos[i] = {
                name: organizationRepos[i].name,
                privacity: organizationRepos[i].private,
            }
        }
        res.status(200).send(repos)
    }
}