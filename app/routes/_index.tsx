import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import HeroSection from "~/components/HeroSection";
import { useOptionalUser } from "~/utils";

export const meta: MetaFunction = () => [{ title: "LexiTrac" }];

export default function Index() {
  const user = useOptionalUser();
  return (
    <main>
      <HeroSection />
    </main>
  );
}
