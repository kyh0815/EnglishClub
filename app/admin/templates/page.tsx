import type { Metadata } from "next";
import AdminDashboard from "../AdminDashboard";

export const metadata: Metadata = {
  title: "Templates | The Round Admin",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminTemplatesPage() {
  return <AdminDashboard initialView="templates" />;
}
