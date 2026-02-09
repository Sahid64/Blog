import Link from "next/link";
import type { Metadata } from "next";
import { projects } from "./project-data";

export const metadata: Metadata = {
  title: "Projects",
  description: "",
};

export default function Projects() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium tracking-tight">Projects</h1>
      <div>
        {projects.map((project, index) => (
          <Link
            key={index}
            href={project.url}
            className="flex flex-col mb-5 space-y-1 transition-opacity duration-200 hover:opacity-80"
            target={project.url.startsWith("http") ? "_blank" : undefined}
            rel={project.url.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            <div className="flex flex-col items-start justify-between w-full space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
              <h2 className="text-black dark:text-white">{project.title}</h2>
            </div>
            <p className="tracking-tight text-neutral-600 dark:text-neutral-400">
                {project.description}
              </p>
            <img
              src={project.img}
              alt={`Image for ${project.title}`}
              className="object-fill w-full rounded-md h-[300PX]"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
