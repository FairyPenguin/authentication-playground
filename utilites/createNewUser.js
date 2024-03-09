import { prisma } from "./PrismaDB.js";

async function createNewUser(userName) {


    try {

        const newUser = await prisma.user.create({
            data: {
                name: userName,
                email: `${userName}@emailzo.com`
            },
        })

        console.log(newUser)
        return newUser

    } catch (error) {

        if (error.code === 'P2002') {
            console.log(error);

            throw new Error(`Email already registered`)

        } else {

            throw new Error(`Prisma Error:`, error)

        }

    }








}



// createNewUser().then(async () => {
//     await prisma.$disconnect()

// }).catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
// })

export default createNewUser