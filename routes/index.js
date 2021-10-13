const express = require('express')
const router = express.Router()
const axios = require('axios')

const app_token_id = '44e6bde78645589b252a'
const app_secret = process.env.GITHUB_CLIENT_SECRET

router.get('/', async (req, res) => {
    if (req.query.code) {
        const data = await axios.get(`https://github.com/login/oauth/access_token?client_id=${app_token_id}&client_secret=${app_secret}&code=${req.query.code}`)
        console.log(data)
    }

    console.log(req.query)
    res.sendStatus(200)
})

router.get('/gh-auth/', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${app_token_id}&scope=repo`)
})

module.exports = router