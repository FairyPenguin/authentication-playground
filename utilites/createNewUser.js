import { prisma } from "./PrismaDB.js";

async function createNewUser(userName) {

    const newUser = await prisma.user.create({
        data: {
            name: userName,
            email: `${userName}@emailzo.com`
        },
    })

    console.log(newUser)

    return newUser
}


// createNewUser().then(async () => {
//     await prisma.$disconnect()

// }).catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
// })

export default createNewUser