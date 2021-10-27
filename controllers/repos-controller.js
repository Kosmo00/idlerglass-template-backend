const GhClient = require('../services/endpoints/api-github')
const Cripto = require('../services/crypto')

module.exports = class ReposController {

    static async organizationRepoData(req, res) {
        const token_data = req.header('x-token')
        const { organization, repo } = req.params
        const token = await Cripto.getGhTokenFromJWT(token_data)
        let organizationRepoData = {}
        organizationRepoData.name = repo
        organizationRepoData.issues = await GhClient.getAllOrgRepoIssues(token, organization, repo)
        organizationRepoData.labels = await GhClient.getAllOrgRepoLabels(token, organization, repo)
        organizationRepoData.collaborators = await GhClient.getAllOrgRepoCollaborators(token, organization, repo)
        res.status(200).send(organizationRepoData)
    }
}