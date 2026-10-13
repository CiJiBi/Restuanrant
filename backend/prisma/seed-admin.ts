import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Quản trị viên";

  if (!email || !password || password.length < 12) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) in the environment before running this script.");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Tài khoản đã tồn tại; không thay đổi mật khẩu hoặc vai trò.");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { email, name, password: hashedPassword, role: "ADMIN", isActive: true },
  });
  console.log("Đã tạo tài khoản quản trị ban đầu:", email);
}

main()
  .catch((error) => {
    console.error("Không thể khởi tạo tài khoản quản trị:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
