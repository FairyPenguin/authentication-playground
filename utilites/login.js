import { prisma } from "./PrismaDB.js";

async function login(userName) {

    const checkUser = await prisma.user.findUnique({
        where: {
            name: userName,
            email: `${userName}@emailzo.com`
        },
        select: { name: true, id: true }
    })


    if (checkUser === null) {
        return "Wrong username"
    }

    /* Tokens -------------------->> */

    // const accessToken = generateAccessToken(checkUser)

    // const refreshToken = generateRefreshToken(checkUser)

    // refreshTokens.push(refreshToken)

    /* Tokens <<-------------------- */


    const databseUserName = checkUser.name

    const databseUserId = checkUser.id

    return {
        id: databseUserId,
        username: databseUserName,
        // accessToken: accessToken,
        // refreshToken: refreshToken
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