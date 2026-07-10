import type { Metadata } from "next";
import AdminDashboard from "../AdminDashboard";

export const metadata: Metadata = {
  title: "Applications | The Round Admin",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminApplicationsPage() {
  return <AdminDashboard initialView="applications" />;
}
