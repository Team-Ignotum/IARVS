
import { Prisma, PrismaClient } from "../generated/prisma/client";
import BaseRepository from "./baseRepository";

export type StudentStatusName = "active" | "inactive";

export interface CreateStudentData {
  userId: number;
  registrationNumber: string;
  intake?: string;
  status?: StudentStatusName;
}

export interface ListStudentsOptions {
  search?: string;
  status?: StudentStatusName;
  skip?: number;
  take?: number;
}

type Student = Prisma.StudentGetPayload<{}>;

type PrismaStudentStatus = Prisma.StudentCreateInput["status"];

function toPrismaStatus(
  status: StudentStatusName
): PrismaStudentStatus {
  const statuses: Record<StudentStatusName, PrismaStudentStatus> = {
    active: "ACTIVE",
    inactive: "INACTIVE",
  };

  return statuses[status];
}

function toStudentWhereInput(
  options: ListStudentsOptions
): Prisma.StudentWhereInput {
  return {
    ...(options.status !== undefined
      ? { status: toPrismaStatus(options.status) }
      : {}),
    ...(options.search
      ? {
          OR: [
            {
              registrationNumber: {
                contains: options.search,
                mode: "insensitive",
              },
            },
            {
              user: {
                is: {
                  firstName: {
                    contains: options.search,
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              user: {
                is: {
                  lastName: {
                    contains: options.search,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        }
      : {}),
  };
}

export class StudentRepository extends BaseRepository<
  Student,
  Prisma.StudentCreateInput,
  number
> {
  constructor(private readonly db: PrismaClient) {
    super(db.student as any);
  }

  findById(id: number) {
    return this.getById(id);
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
    return this.getAll({
      where: toStudentWhereInput(options),
      ...(options.skip !== undefined ? { skip: options.skip } : {}),
      ...(options.take !== undefined ? { take: options.take } : {}),
      orderBy: { createdAt: "desc" },
    });
  }

  count(options: ListStudentsOptions = {}) {
    return this.db.student.count({
      where: toStudentWhereInput(options),
    });
  }

  createStudent(data: CreateStudentData) {
    return this.create({
      user: {
        connect: { id: data.userId },
      },
      registrationNumber: data.registrationNumber,
      ...(data.intake !== undefined ? { intake: data.intake } : {}),
      status: data.status
        ? toPrismaStatus(data.status)
        : "ACTIVE",
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
    return this.getAcademicRecords(studentId);
  }
}
