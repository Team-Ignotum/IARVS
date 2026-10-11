
import { Prisma, PrismaClient } from "../generated/prisma/client";
import BaseRepository from "./baseRepository";

const publicUserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

type PublicUser = Prisma.UserGetPayload<{
  select: typeof publicUserSelect;
}>;

export type UserRoleName =
  | "student"
  | "admin"
  | "staff"
  | "superStaff";

export interface CreateUserData {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRoleName;
}

export interface ListUsersOptions {
  role?: UserRoleName;
  isActive?: boolean;
  skip?: number;
  take?: number;
}

type PrismaUserRole = Prisma.UserCreateInput["role"];

function toPrismaRole(role: UserRoleName): PrismaUserRole {
  const roles: Record<UserRoleName, PrismaUserRole> = {
    student: "STUDENT",
    admin: "ADMIN",
    staff: "STAFF",
    superStaff: "SUPER_STAFF",
  };

  return roles[role];
}

function toUserWhereInput(
  options: ListUsersOptions
): Prisma.UserWhereInput {
  return {
    ...(options.role !== undefined
      ? { role: toPrismaRole(options.role) }
      : {}),
    ...(options.isActive !== undefined
      ? { isActive: options.isActive }
      : {}),
  };
}

export class UserRepository extends BaseRepository<
  PublicUser,
  Prisma.UserCreateInput,
  number
> {
  constructor(private readonly db: PrismaClient) {
    super(db.user as any);
  }

  findById(id: number): Promise<PublicUser | null> {
    return this.db.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });
  }

  findByEmail(email: string): Promise<PublicUser | null> {
    return this.db.user.findUnique({
      where: { email },
      select: publicUserSelect,
    });
  }

  findMany(options: ListUsersOptions = {}): Promise<PublicUser[]> {
    return this.db.user.findMany({
      where: toUserWhereInput(options),
      skip: options.skip,
      take: options.take,
      orderBy: { createdAt: "desc" },
      select: publicUserSelect,
    });
  }

  count(options: ListUsersOptions = {}): Promise<number> {
    return this.db.user.count({
      where: toUserWhereInput(options),
    });
  }

  createUser(data: CreateUserData): Promise<PublicUser> {
    return this.db.user.create({
      data: {
        email: data.email,
        password: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: toPrismaRole(data.role),
      },
      select: publicUserSelect,
    });
  }

  setPasswordHash(
    id: number,
    passwordHash: string
  ): Promise<PublicUser> {
    return this.db.user.update({
      where: { id },
      data: { password: passwordHash },
      select: publicUserSelect,
    });
  }

  setActiveStatus(
    id: number,
    isActive: boolean
  ): Promise<PublicUser> {
    return this.db.user.update({
      where: { id },
      data: { isActive },
      select: publicUserSelect,
    });
  }

  deleteUser(id: number): Promise<PublicUser> {
    return this.db.user.delete({
      where: { id },
      select: publicUserSelect,
    });
  }
}
