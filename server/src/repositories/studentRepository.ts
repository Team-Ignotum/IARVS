import type { User } from "../generated/client";
import prisma from "@/lib/prisma";

export class StudentRepository {
  //get all
  getAll(): Promise<User[]> {
    return prisma.user.findMany({
      where: { role: "STUDENT" },
    });
  }

  //get Student By Registration Number
  getByRegNumber(regNumber: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        regNumber,
        role: "STUDENT",
      },
    });
  }

  //Get Student By student number
  getByStudentNumber(stNumber: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        stNumber,
        role: "STUDENT",
      },
    });
  }

  // Get students by intake
  getByIntake(intake: string): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        intake,
        role: "STUDENT",
      },
    });
  }

  // Get student with academic records
  getWithAcademicRecords(stNumber: string) {
    return prisma.user.findFirst({
      where: { stNumber, role: "STUDENT" },
      include: { academicRecords: true },
    });
  }

  // Get student with enrollments
  getWithEnrollments(stNumber: string) {
    return prisma.user.findFirst({
      where: { stNumber, role: "STUDENT" },
      include: { enrollments: true },
    });
  }

  // Get student with academic records and enrollments
  getFullDetails(stNumber: string) {
    return prisma.user.findFirst({
      where: { stNumber, role: "STUDENT" },
      include: {
        academicRecords: true,
        enrollments: true,
      },
    });
  }

  // Get academic records for a student
  getAcademicRecords(stNumber: string) {
    return prisma.academicRecord.findMany({
      where: { studentId: stNumber },
    });
  }

  // Get enrollments for a student
  getEnrollments(stNumber: string) {
    return prisma.studentEnrollment.findMany({
      where: { studentId: stNumber },
    });
  }

  // Get students with a particular status
  getByStatus(status: "ACTIVE" | "INACTIVE") {
    return prisma.user.findMany({
      where: {
        role: "STUDENT",
        status,
      },
    });
  }
}
