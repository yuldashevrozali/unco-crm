"use server";
import { revalidatePath } from "next/cache";

export async function addStudent(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const group = formData.get("group") as string;
  const teacher = formData.get("teacher") as string;

  // DB bilan ishlovchi kod (prisma yoki boshqasi bo'lishi mumkin)
  // await prisma.student.create({ data: { name, phone, group, teacher } });

  console.log("Yangi o‘quvchi qo‘shildi:", { name, phone, group, teacher });

  revalidatePath("/students"); // Sahifani yangilash
}
