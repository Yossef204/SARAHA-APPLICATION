import {  NotFoundException, SYS_MESSAGE } from "../../common/index.js";
import { UserRepo } from "../../DB/index.js"
import fs from 'node:fs'

export const checkUserExist =async (filter)=>{
    return await UserRepo.getOne(filter)
}

export const createUser = async (data) => {
    return await UserRepo.create(data);
}

export const uploadpic = async (filter, data)=>{
   const updatedUser = await UserRepo.update({_id : filter._id }, { profilePicture: data.path });
   if(!updatedUser){
    throw new NotFoundException(SYS_MESSAGE.user.notFound)
   }
   if(fs.existsSync(filter.profilePicture)){
        fs.unlinkSync(filter.profilePicture);
   }
   return updatedUser;
}