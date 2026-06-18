import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Vôlei Preá" },
    { name: "description", content: "Gerenciamento de partidas de vôlei" },
  ];
}

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[#4a4a4a] p-4 text-center text-white sm:gap-6 sm:p-6 md:gap-8 lg:gap-10">
      <h1 className="font-display text-2xl uppercase sm:text-3xl md:text-4xl lg:text-5xl">
        Vôlei Preá
      </h1>
      <Link
        to="/progress"
        className="font-display min-h-11 rounded-lg bg-[#e85d2a] px-6 py-2.5 text-lg uppercase sm:min-h-12 sm:px-8 sm:py-3 sm:text-xl md:text-2xl lg:px-10 lg:py-4"
      >
        Abrir protótipo
      </Link>
    </main>
  );
}
