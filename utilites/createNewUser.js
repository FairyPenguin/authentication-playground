import { prisma } from "./PrismaDB.js";

async function createNewUser(userName) {

    const newUser = await prisma.user.create({
        data: {
            name: userName,
            email: `${userName}@emailzo.com`
        },
    })

    console.log(newUser)
}

export default createNewUser