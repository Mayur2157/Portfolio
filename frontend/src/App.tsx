import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Contact } from "./components/sections/Contact";
import { Education } from "./components/sections/Education";
import { Experience } from "./components/sections/Experience";
import { Hero } from "./components/sections/Hero";
import { Impact } from "./components/sections/Impact";
import { Projects } from "./components/sections/Projects";
import { Skills } from "./components/sections/Skills";
import { useGithubRepos } from "./hooks/useGithubRepos";

export function App() {
  const repos = useGithubRepos();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero repos={repos} />
        <Impact />
        <Experience />
        <Projects repos={repos} />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
