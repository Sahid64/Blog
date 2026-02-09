export interface Project {
  title: string;
  year: number;
  description: string;
  url: string;
  img: string;
}

export const projects: Project[] = [
  {
    title: "",
    year: 2024,
    description: "Educational game developed in Python using Pygame. This project is designed to raise awareness about the importance of climate restoration and oxygen preservation on our planet.",
    url: "/projects/oxyfender",
    img: 'project-oxyfender.png'
  },

];
