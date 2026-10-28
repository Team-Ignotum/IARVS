import type {User} from "../generated/client"
import prisma from "@/lib/prisma"


export class UserRepository{
    //get all
    getAll(): Promise<User[]>{
        return prisma.user.findMany();
  }

  //get users by user email
  getByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  //get by user ID
  findByUserId(userId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { userId },
    });
  }

  //getby Register number
  findByRegNumber(regNumber: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { regNumber },
    });
  }

  //create a user
  create(data: {
    userId: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role: "STUDENT" | "ADMIN" | "STAFF" | "SUPER_STAFF";
    centerId: string;
    regNumber?: string | null;
    stNumber?: string | null;
    intake?: string | null;
  }) {
    const { centerId, ...userData } = data;

    return prisma.user.create({
      data: {
        ...userData,
        // Links the user to an existing centre; the centre row is never created here.
        center: { connect: { centerId } },
      },
    });
  }

  //update users by email
  async updateByEmail(email: string, data: Partial<User>) {
    return prisma.user.update({
      where: { email },
      data,
    });
  }

  //delete
  delete(userId: string): Promise<User>{
    return prisma.user.delete({
        where: {userId}
    })
  }
}