// /app/sketch/page.tsx
import ProjectPage from "@/src/components/ProjectPage";

export default function SketchPage() {
  return <ProjectPage page="sketch" api="/api/sketch" title={false} />;
}
