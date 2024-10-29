import ComponentShowDown from "@/features/hero/components-showdown";
import HeroPage from "@/features/hero/hero-page";

import MoreSkills from "@/features/hero/more-skills";

export default function Page() {
  return (
    <section>
      <HeroPage />
      <ComponentShowDown />
      <MoreSkills />
    </section>
  );
}
