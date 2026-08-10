import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Bơm 1 Danh mục 'Đồ uống' vào SQL Server
  const category = await prisma.category.create({
    data: {
      name: "Đồ uống",
      // description: 'Các loại nước giải khát' (Thêm nếu Schema của bạn yêu cầu)
    },
  });
  console.log("✅ Đã tạo thành công Danh mục:", category);
}

main()
  .catch((e) => {
    console.error("❌ Lỗi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
