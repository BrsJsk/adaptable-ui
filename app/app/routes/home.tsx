import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Home" }, { name: "description", content: "Home page" }];
}

export default function Home() {
  return <h1 className="text-2xl font-semibold">Home</h1>;
}
