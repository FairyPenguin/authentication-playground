import { prisma } from "./PrismaDB.js";

async function loginCheck(userName) {

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


    const databseUserName = checkUser?.name
    const databseUserId = checkUser?.id

    return {
        id: databseUserId,
        username: databseUserName,
    }



}


export { loginCheck }