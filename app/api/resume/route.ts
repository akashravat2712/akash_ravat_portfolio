import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { readResume, writeResume, type ResumeData } from "@/lib/resume";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json(readResume());
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let data: ResumeData;
  try {
    data = (await request.json()) as ResumeData;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!data?.frontmatter) {
    return NextResponse.json(
      { error: "Invalid resume payload." },
      { status: 400 }
    );
  }

  writeResume({
    frontmatter: data.frontmatter,
    about: data.about || "",
    skills: Array.isArray(data.skills) ? data.skills : [],
    experience: Array.isArray(data.experience) ? data.experience : [],
    projects: Array.isArray(data.projects) ? data.projects : [],
    education: Array.isArray(data.education) ? data.education : [],
    contact: data.contact || "",
  });

  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
