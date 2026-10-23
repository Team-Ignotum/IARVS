import {hash} from "bcrypt-ts";
import { Prisma } from "@/generated/client";
import { UserRepository } from "@/repositories/user_repository_impl";
import type { RegisterInput} from "@/app/api/(auth)/register/register.schema";


export async function registerUser(input:RegisterInput){
    const userRepository = new UserRepository();

    const email = input.email.trim().toLowerCase();

    //check whether user exists or not
    const existingUser = await userRepository.getByEmail(email);

    if (existingUser){
        throw new Error("User Already Exists");
    }
    //hash the password
    const passwordHash = await hash(input.password, 12);

    try {
       //create the user
       const user = await userRepository.create({
           userId: input.userId,
           email,
           passwordHash,
           firstName:input.firstName,
           lastName: input.lastName,
           role: input.role,
           center: input.center,
           regNumber:input.regNumber,
           stNumber:input.stNumber,
           intake:input.intake,
       });
       return user;
    } catch (error){
        //handle duplicate values and concurrent requests
        if(
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            throw new Error("Duplicate User Data")
        }
        throw error;
    }
}