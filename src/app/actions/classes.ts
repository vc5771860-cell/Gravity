"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { redirect } from "next/navigation";

async function getSession() {
  const sessionCookie = (await cookies()).get("session")?.value;
  return decrypt(sessionCookie);
}

export async function createClassSession(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  if (!title) {
    throw new Error("Class title is required");
  }

  const classSession = await prisma.classSession.create({
    data: {
      title,
      teacherId: session.userId,
      startTime: new Date(),
    },
  });

  redirect(`/classroom/${classSession.id}`);
}

export async function getActiveClasses() {
  return await prisma.classSession.findMany({
    where: {
      endTime: null,
    },
    include: {
      teacher: {
        select: { name: true },
      },
    },
    orderBy: {
      startTime: "desc",
    },
  });
}
