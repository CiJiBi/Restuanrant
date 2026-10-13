import { redirect } from "next/navigation";

export default function AdminRootPage() {
  // Bất cứ ai truy cập vào localhost:3000/admin
  // sẽ tự động bị đẩy sang localhost:3000/admin/dashboard
  redirect("/admin/dashboard");
}
