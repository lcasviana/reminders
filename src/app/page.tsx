import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { MainPanel } from "@/features/main-panel/main-panel";
import { AppSidebar } from "@/features/sidebar/app-sidebar";

export default function Home() {
  return (
    <SidebarProvider
      style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}
    >
      <AppSidebar />
      <SidebarInset>
        <MainPanel />
      </SidebarInset>
    </SidebarProvider>
  );
}
