const jwt = require('jsonwebtoken')
const createError  =require('http-errors')
const { token } = require('morgan')
const User = require('../Models/User.model')


module.exports  ={
    signAccessToken : (userId) =>{
        return new Promise((resolve, reject) => {
            const payload = { audience: userId}
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn:'1d',
                issuer:'Beatzz.com',
               
            }
            jwt.sign(payload, secret, options, (err, token) => {
                 if (err) {
                     console.log(err.message)
                     console.log("token error")
                     reject(createError.InternalServerError())
                 }
                resolve(token)
            })
        })
    },

    verifyAccessToken: (req,res,next)=>{
        if(!req.headers['authorization']) 
            return next(createError.Unauthorized())

        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token  = bearerToken[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload)=> {
            if (err){   
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
                    return next(createError.Unauthorized(message))           
            }

            req.payload = payload
            next()
        })
    },
    
    signRefreshToken : (userId) =>{
        return new Promise((resolve, reject) => {
            const payload = {audience: userId}
            const secret = process.env.REFRESH_TOKEN_SECRET
            const options = {
                expiresIn:'1y',
                issuer:'Beatzz.com',
                
            }
            jwt.sign(payload, secret, options, (err, token) => {
                 if (err) {
                     console.log(err.message)
                     console.log("token error")
                     reject(createError.InternalServerError())
                 }
                resolve(token)
            })
        })
    },

    // const userId = payload.audience
    //         let user = await User.findById(userId)

    //         console.log(user.ROLE)
    //         if(user.ROLE !== userRole){
    //             return next(createError.Unauthorized(message))
    //         }

    //         next()
    
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, payload)=>{
                if (err) return reject(createError.Unauthorized())
                const userId = payload.audience
                let user = await User.findById(userId)

                console.log(user.ROLE)
                resolve(userId)
            })
        })
    },
    
    // verifyUserRole: (req,res,next)=>{
    //     if(!req.headers['authorization']) 
    //         return next(createError.Unauthorized())

    //     const authHeader = req.headers['authorization']
    //     const bearerToken = authHeader.split(' ')
    //     const token  = bearerToken[1]
    //     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload)=> {
    //         if (err){   
    //             const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
    //                 return next(createError.Unauthorized(message))           
    //         }
            
    //         const userId = payload.audience
    //         let user = await User.findById(userId)

    //         console.log(user.ROLE)
    //         if(user.ROLE !== userRole){
    //             return next(createError.Unauthorized(message))
    //         }

    //         next()
            
    //     })
    // },

    verifyUserRole : (userRole) => {
        return (req, res, next) => {
            if(!req.headers['authorization']) 
            return next(createError.Unauthorized())

        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token  = bearerToken[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload)=> {
            if (err){   
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
                    return next(createError.Unauthorized(message))           
            }
            
            const userId = payload.audience
            let user = await User.findById(userId)

            console.log(user.ROLE)
            if(user.ROLE !== userRole){
               res.status(401)
               return res.send('Not allowed') 
            }

            next()
            
        })
          
        }
      }
}