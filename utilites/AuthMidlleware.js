import jwt from "jsonwebtoken"

function authMidlleware(req, res, next) {

    const authToken = req.headers.authorization


    if (!authToken) {
        return res.sendStatus(401)
    }

    if (authToken && authToken.startsWith("Bearer ")) {

        const token = authToken.substring(7)

        const data = jwt.verify(token, process.env.JWT_TOKEN_SECRET)

        console.log(data);

    }




    next()
}

export default authMidlleware