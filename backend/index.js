const express = require('express')
const cors = require('cors')
const port = 3096
const app = express()
const db_config = require('./config/db')
const router = require('./config/router')

// middlewares
app.use(express.json())
app.use(cors())
// call db connection
db_config()
// uses rouets
app.use(router)
// set ejs template
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})

