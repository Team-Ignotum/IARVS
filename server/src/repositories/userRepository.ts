
import { Prisma, User } from "../generated/prisma/client";

export interface UserRepository {
  getAll(options?: Prisma.UserFindManyArgs): Promise<User[]>;

  getById(id: number): Promise<User | null>;

  getByEmail(email: string): Promise<User | null>;

  create(data: Prisma.UserCreateInput): Promise<User>;

  update(
    id: number,
    data: Prisma.UserUpdateInput
  ): Promise<User>;

  updateByEmail(
    email: string,
    data: Prisma.UserUpdateInput
  ): Promise<User>;

  delete(id: number): Promise<User>;
}
