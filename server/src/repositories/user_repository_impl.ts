import type { User } from "../generated/client";
import type { Prisma } from "../generated/client";
import prisma from "@/lib/prisma"

const ADMIN_USER_SELECT = {
  userId: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  status: true,
  stNumber: true,
  regNumber: true,
  intake: true,
  createdAt: true,
  center: {
    select: { centerId: true, centerName: true },
  },
} satisfies Prisma.UserSelect;


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

  //Aggregated role/status counts for the dashboard cards
  groupByRoleAndStatus() {
    return prisma.user.groupBy({
      by: ["role", "status"],
      _count: { _all: true },
    });
  }

  //Admin listing: never selects passwordHash or other credentials
  findForAdmin(where: Prisma.UserWhereInput, skip: number, take: number) {
    return prisma.user.findMany({
      where,
      select: ADMIN_USER_SELECT,
      orderBy: [{ createdAt: "desc" }, { userId: "asc" }],
      skip,
      take,
    });
  }

  countForAdmin(where: Prisma.UserWhereInput) {
    return prisma.user.count({ where });
  }

  // `isActive` is the flag the login route checks, so it must move with `status`
  // or an "inactive" user could still sign in.
  updateStatus(userId: string, status: "ACTIVE" | "INACTIVE") {
    return prisma.user.update({
      where: { userId },
      data: { status, isActive: status === "ACTIVE" },
      select: ADMIN_USER_SELECT,
    });
  }
}