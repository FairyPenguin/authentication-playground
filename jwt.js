import express from "express";
import jsonwebtoken from "jsonwebtoken"
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

app.use(express.urlencoded({ extended: false }))


app.set("view engine", "ejs")
app.set("views", "./views")

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


let name = "Guest User"

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

    if (!user) {
        return res.status(442).json({ error: "Incorrect username" })
    }

    name = user.username

    // res.redirect("/profile")

    /* Tokens -------------------->> */

    const accessToken = generateAccessToken(user)

    const refreshToken = generateRefreshToken(user)

    refreshTokens.push(refreshToken)

    /* Tokens <<-------------------- */

    res.send({ user, accessToken })


})


app.post("/api/auth/refresh", (req, res) => {

    /**
     * 1- Check if the token avilable 
     * 2- Check if the token valid
     * 3- If it passes 1&2 
     *    Generate new access token and refresh token
     *  */

    const refreshToken = req.body.token

    if (!refreshToken) {
        return res.status(401).json("Not authanticated")
    }




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




app.post("/logout", (req, res) => {

    res.redirect("/")

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