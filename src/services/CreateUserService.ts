import { getCustomRepository } from "typeorm";
import { UsersRepositories } from "../repositories/UsersRepositores";
import { hash } from "bcryptjs";

interface IUserRequest {
  name: string;
  email: string;
  admin?: boolean
  password: string;
}

class CreateUserService {
  async execute({ name, email, admin = false, password} : IUserRequest) {
    const usersRepository = getCustomRepository(UsersRepositories);

    if(!email) {
      throw new Error("Email incorrect"); 
    }
 
    const usersAlreadyExists = await usersRepository.findOne({
      email
    });

    if(usersAlreadyExists) {
      throw new Error("User already existy");
    }

    const passwordHash = await hash(password, 8)

    const user = usersRepository.create({
      name,
      email,
      admin,
      password: passwordHash,
    })

    await usersRepository.save(user);

    return user;
  }
}

export {CreateUserService}