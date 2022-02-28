 const express = require('express')
 const morgan = require ('morgan')
 const creteError = require ('http-errors')
 
 require('dotenv').config()
 require('./helpers/init_mongodb')

 const AuthRoute = require('./Routes/Auth.route')

 const app = express()
 app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))


 app.get('/', async(req,res,next)=>{
     res.send("Hello from express")
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