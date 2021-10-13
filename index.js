const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

// Settings

require('dotenv').config()
app.set('port', process.env.PORT || 2500)

// Middlewares

app.use(morgan('dev'))
app.use(express.json())

// Routes

app.use('/', require('./routes/index'))

// Starting the server

app.listen(app.get('port'), () => console.log(`Server on port ${app.get('port')}`))
