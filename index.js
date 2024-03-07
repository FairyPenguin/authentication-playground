import express from "express"
import session from "express-session"
import cookieParser from "cookie-parser"
import { fileURLToPath } from "url"
import path from "path"

// import { prisma } from "./database.js"

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())


app.use(session({
    secret: "Session String",
    cookie: {},
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma,
        {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined
        }
    )
}))

app.set("view engine", "ejs")
app.set("views", "./views")

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


// async function main() {

//     const newUser = await prisma.user.create({
//         data: {
//             name: "newUserFromNodejs",
//             email: "newUserFromNodejs@gmail.com"
//         },
//     })

//     console.log(newUser)
// }

// app.use(express.static("public"))
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    console.log(req.cookies)

    let name = "Guest User"



    if (req.session.user) {
        name = req.session.user
    }

    // res.cookie("myCookie", "Cookie_Monster",
    //     {
    //         httpOnly: true,
    //         // secure:true //in Production,
    //         maxAge: 12000
    //     })

    // res.sendFile(__dirname + "/views/index.html");
    // res.json("Looking at the ⭐️⭐️⭐️⭐️")
    res.render("index", { name })

})


app.post("/profile", (req, res) => {

    req.session.user = req.body.name.trim()

    res.send(`<h2>Thanks, Go to your mother <a href="/">Mom</a></h>`)

})

app.post("/logout", (req, res) => {
    req.session.destroy(err => {
        res.redirect("/")
    })
})


// main().then(async () => {
//     await prisma.$disconnect()

// }).catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
// })


app.listen(8080)