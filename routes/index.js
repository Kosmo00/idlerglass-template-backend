const express = require('express')
const router = express.Router()
const { isAuth } = require('../middlewares/auth')

const UsersController = require('../controllers/users-controller')
const OrganizationsController = require('../controllers/organizations-controller')

const app_token_id = '44e6bde78645589b252a'

// user routes
router.post('/', UsersController.loginUser)
router.get('/organizations', isAuth, UsersController.userOrganizations)

// organization routes
router.get('/:organization/repos', OrganizationsController.organizationRepos)

router.get('/gh-auth/', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${app_token_id}&scope=admin:org,repo,user,read:packages,read:discussion`)
})

module.exports = router