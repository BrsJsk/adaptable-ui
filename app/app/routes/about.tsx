import type { Route } from "./+types/about";

export function meta({}: Route.MetaArgs) {
  return [{ title: "About" }, { name: "description", content: "About page" }];
}

export default function About() {
  return <h1 className="text-2xl font-semibold">About</h1>;
}
