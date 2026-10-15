
import {
  Prisma,
  PrismaClient,
  User,
} from "../generated/prisma/client";

import prisma from "@/lib/prisma";
import BaseRepository from "./baseRepository";
import type { UserRepository } from "./userRepository";

export class UserRepositoryImpl
  extends BaseRepository<
    User,
    Prisma.UserCreateInput,
    Prisma.UserUpdateInput,
    number
  >
  implements UserRepository
{
  constructor(db: PrismaClient = prisma) {
    super(db.user as any);
  }

  getByEmail(email: string): Promise<User | null> {
    return this.modelClient.findUnique({
      where: { email },
    });
  }

  updateByEmail(
    email: string,
    data: Prisma.UserUpdateInput
  ): Promise<User> {
    return this.modelClient.update({
      where: { email },
      data,
    });
  }
}
