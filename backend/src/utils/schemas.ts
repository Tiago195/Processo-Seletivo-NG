import j from "joi";
import { joiPasswordExtendCore, JoiPasswordExtend } from "joi-password";
const joi: JoiPasswordExtend = j.extend(joiPasswordExtendCore);


export const UserSchema = joi.object({
  // id: number
  username: joi.string().min(3).required(),
  password: joi.string().minOfNumeric(1).minOfUppercase(1).min(8).required(),
  // accountId: number
})
