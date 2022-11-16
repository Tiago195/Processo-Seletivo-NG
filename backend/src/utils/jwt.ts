import { User } from "@prisma/client";
import jwt, { SignOptions } from "jsonwebtoken";

class Token {
  private static secret = process.env.SECRET || "segredo"
  private static options: SignOptions = { expiresIn: "24h" }

  public static encodeToken(user: Omit<User, "password">) {
    return jwt.sign(user, this.secret, this.options)
  }

  public static decodeToken(token: string) {
    return jwt.verify(token, this.secret)
  }
}

export { Token }