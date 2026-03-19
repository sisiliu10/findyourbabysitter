import type { Metadata } from "next";
import { Topbar } from "@/components/layout/Topbar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { NavigationTimings } from "@/components/NavigationTimings";
import { ToastProvider } from "@/components/ui/Toast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-surface-primary">
        <NavigationTimings />
        <Topbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 pb-20 sm:p-8 lg:pb-8">
            {children}
          </main>
        </div>
        <MobileNav />
      </div>
    </ToastProvider>
  );
}
