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
     * Try to get an Organization's repo data. Return an response from Github
     *
     * @param {string} token Github personal access token
     * @param {string} organization Organization's name
     * @param {string} repo Requested organization's repo
     * @returns {Object} response from Github
     */
    static async getOrganizationRepo(token, organization, repo) {
        const gh_api_request = this.#perpareAxios(token)
        const response = await gh_api_request.get(`/orgs/${organization}/repos/${repo}`)
        return response.data
    }

    /**
     * Try to get an Organization's repo issues. Return an response from Github
     *
     * @param {string} token Github personal access token
     * @param {string} organization Organization's name
     * @param {string} repo Requested organization's repo
     * @returns {Object} response from Github
     */
    static async getOrganizationRepoIssues(token, organization, repo) {
        const gh_api_request = this.#perpareAxios(token)
        const response = await gh_api_request.get(`/orgs/${organization}/repos/${repo}/issues`)
        return response.data
    }
}
