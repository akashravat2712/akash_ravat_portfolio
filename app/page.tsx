import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Footer from "@/components/Footer";
import { readResume } from "@/lib/resume";

const ORBIT_LABELS = ["Data Science", "Full Stack", "AI", "ML"];

export const dynamic = "force-dynamic";

export default function HomePage() {
  const data = readResume();

  return (
    <>
      <Navbar name={data.frontmatter.name} />
      <main>
        <Hero
          frontmatter={data.frontmatter}
          orbitLabels={ORBIT_LABELS}
        />
        <About
          about={data.about}
          photo={data.frontmatter.photo}
          name={data.frontmatter.name}
        />
        <Skills skills={data.skills} />
        <Experience experience={data.experience} />
        <Projects projects={data.projects} />
        <Education education={data.education} />
      </main>
      <Footer data={data} />
    </>
  );
}
