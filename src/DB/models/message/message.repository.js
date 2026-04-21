import { DBRepository } from "../../db.repository.js";
import { Message } from "./message.model.js";

class MessageRepo extends DBRepository {
    constructor(){
        super(Message);
    }
}

export const messageRepo = new MessageRepo();