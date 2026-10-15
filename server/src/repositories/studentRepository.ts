import {
  Prisma,
  PrismaClient,
  Student,
} from "../generated/prisma/client";

import prisma from "@/lib/prisma";
import BaseRepository from "./baseRepository";

// Student creation data
export interface CreateStudentData {
  userId: number;
  registrationNumber: string;
  intake?: string;
  status?: "ACTIVE" | "INACTIVE";
}

// Student repository interface
export interface IStudentRepository {
  getById(userId: number): Promise<Student | null>;

  findByRegistrationNumber(
    registrationNumber: string
  ): Promise<Student | null>;

  getAll(
    options?: Prisma.StudentFindManyArgs
  ): Promise<Student[]>;

  createStudent(data: CreateStudentData): Promise<Student>;

  getEnrollments(studentId: number): Promise<unknown[]>;

  getAcademicRecords(studentId: number): Promise<unknown[]>;
}

// Student repository implementation
export class StudentRepo
  extends BaseRepository<
    Student,
    Prisma.StudentCreateInput,
    Prisma.StudentUpdateInput,
    number
  >
  implements IStudentRepository
{
  constructor(private readonly db: PrismaClient = prisma) {
    super(db.student as any, "userId");
  }

  findByRegistrationNumber(
    registrationNumber: string
  ): Promise<Student | null> {
    return this.db.student.findUnique({
      where: { registrationNumber },
    });
  }


  createStudent(data: CreateStudentData): Promise<Student> {
    return this.db.student.create({
      data: {
        user: {
          connect: { id: data.userId },
        },
        registrationNumber: data.registrationNumber,
        ...(data.intake !== undefined
          ? { intake: data.intake }
          : {}),
        status: data.status ?? "ACTIVE",
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
}