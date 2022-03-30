import { getCustomRepository } from "typeorm"
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"

import { UsersRepositories } from "../repositories/UsersRepositores"



interface IAuthenticateUserService{
  email: string,
  password: string,
}

class AuthenticateUserService {
  async execute({email, password}: IAuthenticateUserService) {
    const usersRepositores = getCustomRepository(UsersRepositories);

    //Verificar se o email existe
    const user = await usersRepositores.findOne({
      email,
    });

    if(!user) {
      throw new Error ("Email/Password incorrect")
    }

    //Verificar se a senha está correta
    const passwordMatch = await compare(password, user.password);
    
    if(!passwordMatch) {
      throw new Error ("Email/Password incorrect")

  }

  //Gerar Token
  const token = sign({
    email: user.email
  }, "e24f515ff5657bea26de05d5bff473b8", {
    subject : user.id,
    expiresIn : "1d"
  })

  return token;
 }
}

export { AuthenticateUserService}