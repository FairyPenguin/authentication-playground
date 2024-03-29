import express from "express"
import session from "express-session"
import cookieParser from "cookie-parser"
import { fileURLToPath } from "url"
import path from "path"
import createNewUser from "./utilites/createNewUser.js";
import { loginCheck } from "./utilites/LoginCheck.js"
import process from "process"
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';
import { styleText } from "util"



const app = express()

const PORT = process.env.PORT || 8080

app.use(express.urlencoded({ extended: false }))
// app.use(cookieParser())

const cookiesSecret = process.env.COOKIES_SESSION_SECRET


const styled = styleText("bgYellowBright", styleText("black", "__The Start of the colored logs__"))

console.log(styled);

// console.log(process.env);

store: { }
// }))

const authMiddleware =
    session({

        secret: cookiesSecret,
        cookie: {
            // maxAge: 7 * 24 * 60 * 60 * 1000 // ms
        },
        resave: false,
        saveUninitialized: false,
        store: new PrismaSessionStore(
            new PrismaClient(),
            {
                // checkPeriod: 2 * 60 * 1000,  //ms
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            }
        )
    })


app.set("view engine", "ejs")
app.set("views", "./views")

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


let name = "Guest User"

app.get("/", (req, res) => {
    // console.log(req.cookies)


    // if (req.session.user) {
    //     name = req.session.user
    // }

    // res.cookie("myCookie", "Cookie_Monster",
    //     {
    //         httpOnly: true,
    //         // secure:true //in Production,
    //         maxAge: 12000
    //     })

    // res.json("Looking at the ⭐️⭐️⭐️⭐️")
    res.render("index", { name })

})


app.post("/login", async (req, res) => {

    const userName = req.body.name

    const checkUser = await loginCheck(userName)

    if (checkUser === null) {
        return res.status(422).json({ error: "Incorrect username" })
    }

    // res.cookie()

    name = checkUser?.username

    res.redirect("/profile")

})



app.post("/register", authMiddleware, async (req, res) => {

    const userName = req.body.name

    try {
        const newUser = await createNewUser(userName)

        req.session.userName = req.body.name

        res.status(200).json({ newUser })

    } catch (error) {

        res.status(409).json({ error: error.message })
    }

})


app.get("/profile", (req, res) => {
    res.render("profile", { name })
})

app.post("/profile", (req, res) => {

    // req.session.user = req.body.name.trim()

    res.send(`<h2>Thanks, Go to your mother <a href="/">Mom</a></h>`)

})

app.post("/logout", authMiddleware, (req, res) => {

    name = "Guest User"


    req.session.destroy(err => {

        if (err) {

            console.error(err);

        } else {

            res.clearCookie("user")

            res.cookie("user", "", { expires: new Date(0) })

            res.redirect("/")

        }
    })

})


app.get("/users", (req, res) => {

    // const query = req.query

    const key = req.query.key
    const value = req.query.value

    // const { query: { key } } = req

    console.log(key);

    res.send({ key })

})

// console.log(process.memoryUsage());

app.listen(PORT, () => {


    console.log(`Running on port: ${styleText("magenta", styleText("bold", `${PORT}`))} `)


    console.log(`Open ${styleText("yellowBright", styleText("bold", `http://localhost:${PORT}`)
    )} in your browser
    `);

    // console.log(styleText("bgYellowBright",
    //     styleText("black", `Open http://localhost:${port} in your browser`)));
})