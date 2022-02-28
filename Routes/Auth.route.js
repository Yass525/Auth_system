const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const { authSchema } = require('../helpers/validationSchema')
const user = require('../Models/User.model')
const { signAccessToken } = require('../helpers/jwt_helper')


router.post('/register', async(req,res,next)=>{
    try {
       const result = await authSchema.validateAsync(req.body) 

        const exist = await user.findOne({email : result.email})
        if(exist) 
            throw createError.Conflict(`${result.email} is already been registered`)
    
        const User = new user(result)
        const savedUser = await User.save()
        const accessToken = await signAccessToken(savedUser.id)

        res.send({accessToken})
    } catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
    }
   
})

router.post('/login', async(req,res,next)=>{
   try {
        const result = await authSchema.validateAsync(req.body)
        const User = await user.findOne({ email: result.email})

        if (!User) throw createError.NotFound("User not registered")

        const isMatch = await User.isValidPassword(result.password)
        if(!isMatch) throw createError.Unauthorized("Username or Password is not valid")

        const accessToken = await signAccessToken(user.id)

        res.send({accessToken})
   } catch (error) {
       if(error.isJoi === true) return next(createError.BadRequest("invalid Username or Password")) 
       next(error)
   }
})

router.post('/refresh-token', async(req,res,next)=>{
    res.send("refresh-token route")
})

router.delete('/logout', async(req,res,next)=>{
    res.send("logout route")
})


module.exports = router