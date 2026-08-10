"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const category = await prisma.category.create({
        data: {
            name: "Đồ uống",
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
//# sourceMappingURL=seed.js.map