import db from "../../db/index.js";

const getUserByIdService = async (id: number) => {
    const user = await db.user.findFirstOrThrow({
        where: {
            id,
        }
    })

    return user
}

export default getUserByIdService;