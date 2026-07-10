import type { Metadata } from "next";
import AdminDashboard from "../AdminDashboard";

export const metadata: Metadata = {
  title: "Inquiries | The Round Admin",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminInquiriesPage() {
  return <AdminDashboard initialView="inquiries" />;
}
