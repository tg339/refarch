import { AppSidebar } from "@/components/app-sidebar";
import { ArchitectureVisualizer } from "@/components/architecture-visualizer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ReactFlowProvider } from "@xyflow/react";
import fs from "fs/promises";
import path from "path";
import { parseBlueprint } from "@/lib/utils/blueprint-parser";

export default async function Page() {
  // Load the blueprint TOML file from the filesystem
  let blueprint;
  try {
    const filePath = path.join(
      process.cwd(),
      "work",
      "architecture-blueprint.toml"
    );
    const tomlContent = await fs.readFile(filePath, "utf-8");
    blueprint = parseBlueprint(tomlContent);
  } catch (err) {
    console.error("Failed to load blueprint:", err);
    blueprint = { layers: [] };
  }

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <SidebarTrigger className="-mr-1 ml-auto rotate-180" />
        </header>
        {/* Architecture visualization using React Flow */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            <ReactFlowProvider>
              <ArchitectureVisualizer blueprint={blueprint} />
            </ReactFlowProvider>
          </div>
        </div>
      </SidebarInset>
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
