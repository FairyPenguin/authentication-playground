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




const app = express()
app.use(express.urlencoded({ extended: false }))
// app.use(cookieParser())

const cookiesSecret = process.env.COOKIES_SESSION_SECRET

// const authMiddleware = app.use(session({
//     secret: cookiesSecret,
//     cookie: {
//         httpOnly: true,
//         maxAge: 6000 // in ms => equal to 5 mins || 1 min = 12000 ms
//     },
//     resave: false,
//     saveUninitialized: false,
//     store: {}
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

    const newUser = await createNewUser(userName)

    req.session.userName = req.body.name

    res.status(200).send({ newUser })

    // req.session.regenerate((err) => {
    //     if (err) {
    //         console.error("Error regenerating session", err);
    //         return res.status(500).send("Internal Server Error")
    //     }


    //     req.session.userName = req.body.name

    //     res.status(200).send({ newUser })

    // })

})


app.get("/profile", (req, res) => {
    res.render("profile", { name })
})

app.post("/profile", (req, res) => {

    req.session.user = req.body.name.trim()

    res.send(`<h2>Thanks, Go to your mother <a href="/">Mom</a></h>`)

})

app.post("/logout", (req, res) => {

    name = "Guest User"
    req.session.destroy(err => {
        res.redirect("/")
    })
})





console.log(process.memoryUsage());
app.listen(8080)