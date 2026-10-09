import Image from "next/image";
import { User } from "lucide-react";
import Reveal from "@/components/Reveal";

type AboutProps = {
  about: string;
  photo: string;
  name: string;
};

export default function About({ about, photo, name }: AboutProps) {
  if (!about) return null;

  const paragraphs = about
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <section id="about" className="border-b border-border py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <div className="grid items-start gap-10 md:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h2 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-2xl tracking-wide md:text-3xl">
                <User className="h-5 w-5 text-red" aria-hidden />
                Introduction
              </h2>
              <div className="mt-4 space-y-5 text-base leading-8 text-muted md:text-lg">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            {photo ? (
              <div className="intro-portrait mx-auto w-full max-w-[320px]">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={photo}
                    alt={name ? `Portrait of ${name}` : "Portrait"}
                    fill
                    sizes="(min-width: 768px) 320px, 80vw"
                    className="object-cover object-[center_84%]"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
