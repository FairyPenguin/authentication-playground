import express from "express";
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url"
import path from "path"
import { prisma } from "./utilites/PrismaDB.js";
import getUsers from "./utilites/getUsers.js"
import createNewUser from "./utilites/createNewUser.js"
import login from "./utilites/login.js";
import authMiddleware from "./utilites/AuthMidlleware.js"
import { styleText } from "util"
import { generateAccessToken, generateRefreshToken } from "./utilites/generateTokens.js";



const app = express()

app.use(cookieParser())

app.use(express.json());  // Built-in middleware for parsing JSON

app.use(express.urlencoded({ extended: false }))


app.set("view engine", "ejs")
app.set("views", "./views")

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


let name = "Guest User"

const accessTokenSecret = process.env.JWT_TOKEN_SECRET
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET


app.get("/", (req, res) => {

    // res.json("JWT is here")
    res.render("index", { name })

})



app.post("/register", (req, res) => {

    const userName = req.body.name

    createNewUser(userName).then(async () => {
        prisma.$disconnect()
    }).catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

    console.log(userName);

    name = userName

    res.redirect("/profile")

})

let refreshTokens = []


app.post("/login", async (req, res) => {

    const userName = req.body.name

    if (!userName) {
        return res.status(442).json({ error: "no username" })
    }

    const user = await login(userName)

    if (!user || user === "Wrong username") {
        return res.status(442).json({ error: "Incorrect username" })
    }

    name = user.username

    // res.redirect("/profile")

    /* Tokens -------------------->> */


    const accessToken = generateAccessToken(user)

    const refreshToken = generateRefreshToken(user)

    refreshTokens.push(refreshToken)

    console.log(refreshTokens)
    /* Tokens <<-------------------- */



    res.send({ user, accessToken, refreshToken })

})

app.post("/json", (req, res) => {

    console.log(req.body.key);
    res.json("jSooooooooon")
})


app.post("/api/auth/refresh", (req, res) => {
    /**
     * 1- Check if the token avilable 
     * 2- Check if the token valid
     * 3- If it passes 1&2 
     *    Generate new access token and refresh token
     *  */

    const refreshToken = req.body.token

    console.log(refreshToken)

    if (!refreshToken) {
        return res.status(401).json("Not authanticated")
    }

    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json("Refresh Token is Invalid")
    }


    jwt.verify(refreshToken, refreshTokenSecret, (error, user) => {
        error && console.error(error)

        // Remove the old refresh-token from the array
        refreshTokens = refreshTokens.filter((token) => {
            !token !== refreshToken
        })

        // Create new Access & Refresh tokens

        const newAccessToken = generateAccessToken(user)

        const newRefreshToken = generateRefreshToken(user)

        refreshTokens.push(newRefreshToken)

        res.status(200).json({

            accessToken: newAccessToken,
            refreshTokens: newRefreshToken

        })

    })


})

app.post("/api/auth/logout", authMiddleware, (req, res) => {

    const refreshToken = req.body.token
    refreshTokens = refreshTokens.filter((token) => {
        !token !== refreshToken
    })

    res.status(200).json("Logged out successfuly.")
})



app.get("/users", async (req, res) => {

    const users = await getUsers()

    res.json(users)

})


app.post("/users", authMiddleware, async (req, res) => {

    // const users = await getUsers()

    // res.json(users)

    console.log(req.body);
    console.log(req.headers);


    try {

        const users = await getUsers();
        res.json(users);

    } catch (err) {

        res.sendStatus(500).json("Invalid Token");

    }

})




app.get("/profile", (req, res) => {
    res.render("profile", { name })
})






// console.log("EL TOKEN", process.env.JWT_TOKEN_SECRET)



// -----------*Cut*------------------ //

const PORT = 8181

app.listen(PORT, () => {


    console.log(`Running on port: ${styleText("magenta", styleText("bold", `${PORT}`))} `)


    console.log(`Open ${styleText("yellowBright", styleText("bold", `http://localhost:${PORT}`)
    )} in your browser
    `);

    // console.log(styleText("bgYellowBright",
    //     styleText("black", `Open http://localhost:${port} in your browser`)));
})