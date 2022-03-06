const express = require('express')
const morgan = require ('morgan')
const creteError = require ('http-errors')

require('dotenv').config()
require('./helpers/init_mongodb')
const { verifyAccessToken } = require('./helpers/jwt_helper')
const { verifyUserRole } = require('./helpers/jwt_helper')

const AuthRoute = require('./Routes/Auth.route')
const User = require('./Models/User.model')
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    max:5,
    windowMs: 1 * 60 * 1000,
    standardHeaders: true,
	legacyHeaders: false, 
})

const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(limiter)

app.get('/', verifyAccessToken, async(req,res,next)=>{
     res.send("basic user")
})

app.get('/admin', verifyAccessToken, verifyUserRole('ADMIN'), async(req,res,next)=>{
    res.send("admin user")
})

app.get('/premium', verifyAccessToken, verifyUserRole('PREMIUM_USER'), async(req,res,next)=>{
    res.send("admin user")
})

app.use('/auth', AuthRoute)

app.use(async(req,res,next)=>{
    // const error = new Error ("Not found")
    // error.status = 404
    // next(error)
    next(creteError.NotFound())
})

app.use((err,req,res,next)=>{
    res.status(err.status || 500)
    res.send({
        error :{
            status: err.status || 500,
            message: err.message,
        }
    })
})

 const PORT = process.env.PORT || 3000

 app.listen(PORT,()=>{
     console.log("server running on port "+PORT)
 })