import { DBRepository } from "../../db.repository.js";
import { User } from "./user.model.js";

class userRepo extends DBRepository {
    constructor(){
        super(User);
    }
}

export const UserRepo = new userRepo();