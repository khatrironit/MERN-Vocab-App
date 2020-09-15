const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const app = express()

const vocabRoute = require('./routes/vocab')

//logs the incoming api requests.
app.use(logger('dev'))

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//Route to handle api requests.
app.use('/',vocabRoute)

//middleware to handle api requests to invalid routes.
app.use((req,res,next)=>{
    const error = new Error('Page Not Found!!')
    error.status = 404
    next(error)
})

//error handling
app.use((error,req,res,next)=>{
    res.status(error.status || 500)
    res.json({
        error : {
            message : error.message
        }
    })
})

module.exports = app