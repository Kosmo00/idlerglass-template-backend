const express = require('express')
const router = express.Router()
const axios = require('axios')

const UsersController = require('../controllers/users-controller')

const app_token_id = '44e6bde78645589b252a'

router.post('/', UsersController.loginUser)

router.get('/gh-auth/', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${app_token_id}&scope=admin:org,repo,user,read:packages,read:discussion`)
})

module.exports = router