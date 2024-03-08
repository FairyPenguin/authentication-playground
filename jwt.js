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



app.post("/registerme", (req, res) => {

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


app.post("/login", async (req, res) => {

    const userName = req.body.name

    const user = await login(userName)

    if (!user) {
        return res.status(442).json({ error: "Incorrect username" })
    }

    name = user.username

    // res.redirect("/profile")

    res.send(user)


})


app.get("/users", async (req, res) => {

    const users = await getUsers()

    res.json(users)

})


app.post("/users", authMiddleware, async (req, res) => {

    const users = await getUsers()

    res.json(users)

})




app.get("/profile", (req, res) => {
    res.render("profile", { name })
})




app.post("/logout", (req, res) => {

    res.redirect("/")

})


// console.log("EL TOKEN", process.env.JWT_TOKEN_SECRET)



// -----------*Cut*------------------ //

const port = 8181

app.listen(port, () => {

    console.log(`listen on port => ${port}`);

})