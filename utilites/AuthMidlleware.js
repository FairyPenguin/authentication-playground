import jwt from "jsonwebtoken"

function authMidlleware(req, res, next) {


    try {

        const authHeaders = req.headers.authorization

        if (!authHeaders) {
            return res.sendStatus(401)
        }
        if (authHeaders && authHeaders.startsWith("Bearer ")) {

            // const token = authToken.substring(7)

            const token = authHeaders.split(" ")[1]

            const data = jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, data) => {
                if (err) {
                    return res.status(403).json("Token is not valid")
                }

                req.data = data
            })

            console.log(data);

            next()

        }

    } catch (error) {

        console.error(error);
        
    }




}

export default authMidlleware