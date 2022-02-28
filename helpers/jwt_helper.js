const jwt = require('jsonwebtoken')
const createError  =require('http-errors')
const { token } = require('morgan')


module.exports  ={
    signAccessToken : (userId) =>{
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn:'1h',
                issuer:'Beatzz.com',
                audience: [userId],
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
    }
}