const axios = require('axios')

const app_token_id = '44e6bde78645589b252a'
const app_secret = process.env.GITHUB_CLIENT_SECRET

module.exports = class GithubEndpoints {
    /**
     * Prepare an Axios instance with the required headers to fetch data using the personal
     * access token
     * 
     * @param {string} token Github personal access token
     * @returns {Axios} Axios instance prepared for Github OAuth querys
     */
    static #perpareAxios(token) {
        return axios.create({
            baseURL: 'https://api.github.com',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${token}`
            }
        })
    }

    /**
     * Receive a code, request for the personal access token and return the response
     * 
     * @param {string} code Code returned by Github after OAuth
     * @returns {Object} Response from Github
     */
    static async getToken(code) {
        const response = await axios.get('https://github.com/login/oauth/access_token', {
            params: {
                client_id: app_token_id,
                client_secret: app_secret,
                code
            },
            headers: {
                'Accept': 'application/json'
            }
        })
        return response.data
    }

    /**
     * Try to get the authenticated user info. Return an response from Github
     * 
     * @param {string} token Github personal access token
     * @returns {Object} Response from Github
     */
    static async getUserInfo(token) {
        const gh_api_request = this.#perpareAxios(token)
        const response = await gh_api_request.get('/user')
        return response.data
    }

    /**
     * Try to get the authenticated user organizations info. Return an response from Github
     * 
     * @param {string} token Github personal access token
     * @returns {Object} response from Github
     */
    static async getUserOrganizations(token) {
        const gh_api_request = this.#perpareAxios(token)
        const response = await gh_api_request.get('/user/orgs')
        return response.data
    }
    /**
     * Try to get an Organization's data. Return an response from Github
     * 
     * @param {string} token Github personal access token
     * @param {string} organization Organization's name
     * @returns {Object} response from Github
     */
    static async getOrganizationData(token, organization) {
        const gh_api_request = this.#perpareAxios(token)
        const response = await gh_api_request.get(`/orgs/${organization}`)
        return response.data
    }

    /**
     * Try to get an Organization's members. Return an response from Github
     *
     * @param {string} token Github personal access token
     * @param {string} organization Organization's name
     * @returns {Object} response from Github
     */
    static async getOrganizationMembers(token, organization) {
        const gh_api_request = this.#perpareAxios(token)
        const response = await gh_api_request.get(`/orgs/${organization}/members`)
        return response.data
    }

    /**
     * Try to get an Organization's repos. Return an response from Github
     *
     * @param {string} token Github personal access token
     * @param {string} organization Organization's name
     * @returns {Object} response from Github
     */
    static async getOrganizationRepos(token, organization) {
        const gh_api_request = this.#perpareAxios(token)
        const response = await gh_api_request.get(`/orgs/${organization}/repos`)
        return response.data
    }

    /**
     * Try to get an Organization's repo issues. Return an response from Github
     * docs: https://docs.github.com/en/rest/reference/issues#list-repository-issues
     * 
     * @param {string} token Github personal access token
     * @param {string} organization Organization's name
     * @param {string} repo Requested organization's repo
     * @param {number} page Page in pagination
     * @param {number} per_page Number of items in pagination
     * @returns {Object} response from Github
     */
    static async getOrganizationRepoIssues(token, organization, repo, page = 1, per_page = 100) {
        const gh_api_request = this.#perpareAxios(token)
        const response = await gh_api_request.get(`/repos/${organization}/${repo}/issues?page=${page}&per_page=${per_page}&state=all`)

        return response.data
    }
    /**
     * Try to get an Organization's repo labels. Return an response from Github
     *
     * @param {string} token Github personal access token
     * @param {string} organization Organization's name
     * @returns {Object} response from Github
     */
    static async getAllOrgRepoLabels(token, organization, repo) {
        const gh_api_request = this.#perpareAxios(token)
        const response = await gh_api_request.get(`/repos/${organization}/${repo}/labels`)
        const labels = response.data.map(label => this.#formatLabelData(label))
        return labels
    }

    /**
     * Try to get an Organization's repo collaborators. Return an response from Github
     *
     * @param {string} token Github personal access token
     * @param {string} organization Organization's name
     * @returns {Object} response from Github
     */
    static async getAllOrgRepoCollaborators(token, organization, repo) {
        const gh_api_request = this.#perpareAxios(token)
        const response = await gh_api_request.get(`/repos/${organization}/${repo}/collaborators`)
        const collaborators = response.data.map(collaborator => this.#formatCollaboratorData(collaborator))
        return collaborators
    }

    /**
     * Try to get all issues in a repo
     *  
     * @param {string} token Github personal access token
     * @param {string} organization Organization's name
     * @param {string} repo Requested organization's repo
     * @returns {Array} List of issues returned by Github
     */
    static async getAllOrgRepoIssues(token, organization, repo) {
        const MAX_PAGES = 100000
        let issues = []
        for (let i = 1; i < MAX_PAGES; i++) {
            const issues_group = await this.getOrganizationRepoIssues(token, organization, repo, i)
            for (let j = 0; j < issues_group.length; j++) {
                if (issues_group[j].pull_request === undefined) {
                    issues.push(this.#formatIssueData(issues_group[j]))
                }
            }
            if (issues_group.length < 100) {
                break
            }
        }
        return issues
    }
    static #formatIssueData(issue) {
        return {
            basic_data: {
                title: issue.title,
                state: issue.state,
                closed_at: issue.closed_at
            },
            assignee: this.#formatCollaboratorData(issue.assignee),
            labels: issue.labels.map(label => this.#formatLabelData(label))
        }
    }
    static #formatCollaboratorData(collaborator) {
        return {
            avatar: collaborator?.avatar_url,
            username: collaborator?.login
        }
    }
    static #formatLabelData(label) {
        return {
            color: label.color,
            description: label.description,
            name: label.name
        }
    }
}
