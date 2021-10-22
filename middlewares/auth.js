module.exports = {
    async isAuth(req, res, next) {
        const remember_token = req.header('x-token')
        if (remember_token) {
            return next()
        }
        return res.status(401).send({message: 'No token received'})
    }
}