import { Prisma, PrismaClient } from "../generated/prisma/client";

export type StudentStatusName =
  | "active"
  | "inactive"
  | "graduated"
  | "suspended"
  | "withdrawn";

export interface CreateStudentData {
  userId: number;
  registrationNumber: string;
  fullName: string;
  intake?: string;
  status?: StudentStatusName;
}

export interface UpdateStudentData {
  registrationNumber?: string;
  fullName?: string;
  intake?: string;
  status?: StudentStatusName;
}

export interface ListStudentsOptions {
  search?: string;
  status?: StudentStatusName;
  skip?: number;
  take?: number;
}

type PrismaStudentStatus = Prisma.StudentCreateInput["status"];

function toPrismaStatus(
  status: StudentStatusName,
): PrismaStudentStatus {
  const statuses: Record<StudentStatusName, PrismaStudentStatus> = {
    active: "ACTIVE",
    inactive: "INACTIVE",
    graduated: "GRADUATED",
    suspended: "SUSPENDED",
    withdrawn: "WITHDRAWN",
  };

  return statuses[status];
}

function toStudentWhereInput(
  options: ListStudentsOptions,
): Prisma.StudentWhereInput {
  return {
    status: options.status
      ? toPrismaStatus(options.status)
      : undefined,

    OR: options.search
      ? [
          {
            registrationNumber: {
              contains: options.search,
              mode: "insensitive",
            },
          },
          {
            fullName: {
              contains: options.search,
              mode: "insensitive",
            },
          },
        ]
      : undefined,
  };
}

export class StudentRepository {
  constructor(private readonly db: PrismaClient) {}

  findById(id: number) {
    return this.db.student.findUnique({
      where: { id },
    });
  }

  findByRegistrationNumber(registrationNumber: string) {
    return this.db.student.findUnique({
      where: { registrationNumber },
    });
  }

  findByUserId(userId: number) {
    return this.db.student.findUnique({
      where: { userId },
    });
  }

  findMany(options: ListStudentsOptions = {}) {
    return this.db.student.findMany({
      where: toStudentWhereInput(options),
      skip: options.skip,
      take: options.take,
      orderBy: { createdAt: "desc" },
    });
  }

  count(options: ListStudentsOptions = {}) {
    return this.db.student.count({
      where: toStudentWhereInput(options),
    });
  }

  create(data: CreateStudentData) {
    return this.db.student.create({
      data: {
        userId: data.userId,
        registrationNumber: data.registrationNumber,
        fullName: data.fullName,
        intake: data.intake,
        status: data.status
          ? toPrismaStatus(data.status)
          : "ACTIVE",
      },
    });
  }

  update(id: number, data: UpdateStudentData) {
    return this.db.student.update({
      where: { id },
      data: {
        registrationNumber: data.registrationNumber,
        fullName: data.fullName,
        intake: data.intake,
        status: data.status
          ? toPrismaStatus(data.status)
          : undefined,
      },
    });
  }

  getEnrollments(studentId: number) {
    return this.db.studentEnrollment.findMany({
      where: { studentId },
      orderBy: { startDate: "desc" },
    });
  }

  getAcademicRecords(studentId: number) {
    return this.db.academicRecord.findMany({
      where: { studentId },
      orderBy: [
        { moduleId: "asc" },
        { attemptNumber: "asc" },
      ],
    });
  }

  getAcademicHistory(studentId: number) {
    return this.db.academicRecord.findMany({
      where: { studentId },
      orderBy: [
        { moduleId: "asc" },
        { attemptNumber: "asc" },
      ],
    });
  }
}