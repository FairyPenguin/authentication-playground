import { prisma } from "./PrismaDB.js";


async function getUsers() {

    const usersFromDB = await prisma.user.findMany()

    const formattedUsers = usersFromDB.map((user) => {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
        }
    })
    // console.log(formattedUsers);

    return formattedUsers
}


export default getUsers