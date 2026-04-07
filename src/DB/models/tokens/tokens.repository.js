import { token } from "./tokens.model.js";

import { DBRepository } from "../../db.repository.js";

class tokensRepo extends DBRepository {
    constructor(){
        super(token);
    }
}

export const tokenRepo = new tokensRepo();