import jwt from "jsonwebtoken"


// ACCESS TOKEN
function generateAccessToken(user) {

    const accessTokenSecret = process.env.JWT_TOKEN_SECRET

    const accessToken = jwt.sign({
        data: { id: user.id, username: user.name }
    }, accessTokenSecret, { expiresIn: "15m" })

    return accessToken

}

// REFRESH TOKEN
function generateRefreshToken(user) {


    const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET

    const refreshToken = jwt.sign({
        data: { id: user.id, username: user.name }
        // No Expire 
    }, refreshTokenSecret)

    return refreshToken
}


export { generateAccessToken, generateRefreshToken }