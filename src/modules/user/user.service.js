import { UserRepo } from "../../DB/index.js"

export const checkUserExist =async (filter)=>{
    return await UserRepo.getOne(filter)
}

export const createUser = async (data) => {
    return await UserRepo.create(data);
}