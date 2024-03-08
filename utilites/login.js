import { name } from "ejs";
import { prisma } from "./PrismaDB.js";
import jwt from "jsonwebtoken"

async function login(userName) {

    const checkUser = await prisma.user.findUnique({
        where: {
            name: userName,
            email: `${userName}@emailzo.com`
        },
        select: { name: true, id: true }
    })


    if (checkUser === null) {
        return null
    }

    const secret = process.env.JWT_TOKEN_SECRET

    const token = jwt.sign({
        data: { id: checkUser.id, username: checkUser.name }
    }, secret)

    const databseUserName = checkUser.name
    const databseUserId = checkUser.id

    return {
        id: databseUserId,
        username: databseUserName,
        token: token
    }

}

login().then(async () => {
    await prisma.$disconnect()

}).catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})


export default login