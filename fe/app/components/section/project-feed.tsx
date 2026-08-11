"use client";

import ProjectsSection, {
  ProjectsErrorState,
  ProjectsLoadingState,
} from "./project";
import { useProjects } from "@/lib/project-queries";

export default function ProjectFeed() {
  const { data: projects, isPending, isError } = useProjects();

  if (isPending) {
    return <ProjectsLoadingState />;
  }

  if (isError) {
    return <ProjectsErrorState />;
  }

  return <ProjectsSection projects={projects} />;
}
