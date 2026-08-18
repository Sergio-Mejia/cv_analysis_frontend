import { AppHeader } from "@/components/common/app-header";
import { CvAnalysisFlow } from "@/features/cv-analysis/components/cv-analysis-flow";
import { CvHero } from "@/features/cv-analysis/components/cv-hero";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pt-8 pb-24 sm:px-6">
      <AppHeader />
      <CvHero />
      <CvAnalysisFlow />
    </main>
  );
}
