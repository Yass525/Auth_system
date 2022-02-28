const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const user = require('../Models/User.model')


router.post('/register', async(req,res,next)=>{
    try {
        const{email, password} = req.body
        if(!email || !password) throw createError.BadRequest
        
        const exist = await user.findOne({email : email})
        if(exist) throw createError.Conflict(`${email} is already been registered`)
    
        const User = new user({email, password})
        const savedUser = await User.save()

        res.send(savedUser)
    } catch (error) {
        next(error)
    }
   
})

router.post('/login', async(req,res,next)=>{
    res.send("login route")
})

router.post('/refresh-token', async(req,res,next)=>{
    res.send("refresh-token route")
})

router.delete('/logout', async(req,res,next)=>{
    res.send("logout route")
})


module.exports = router