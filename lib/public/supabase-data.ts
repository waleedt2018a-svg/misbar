export type ResearchProject = {
  title: string;
  field: string;
  researcher: string;
  description: string;
};

export type Opportunity = {
  title: string;
  faculty: string;
  department: string;
  skills: string;
  status: "مفتوحة" | "مغلقة";
};

export type StudentIdea = {
  title: string;
  major: string;
  problem: string;
  support: "مشرف" | "فريق" | "جهة بحثية";
};

export type PlatformStats = {
  publishedOpportunities: number;
  publishedIdeas: number;
  registeredBeneficiaries: number;
};

export type PublicHomeData = {
  researchProjects: ResearchProject[];
  opportunities: Opportunity[];
  ideas: StudentIdea[];
  stats: PlatformStats;
};

type SupabaseRow = Record<string, unknown>;

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Service configuration is missing");
  }

  return { url, anonKey };
}

function headers() {
  const { anonKey } = getSupabaseConfig();

  return {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    "Content-Type": "application/json"
  };
}

async function getRows(path: string) {
  const { url } = getSupabaseConfig();

  try {
    const response = await fetch(`${url}/rest/v1/${path}`, {
      headers: headers(),
      cache: "no-store"
    });

    if (!response.ok) return [];
    return (await response.json()) as SupabaseRow[];
  } catch {
    return [];
  }
}

async function getCount(table: string, filter = "") {
  const { url } = getSupabaseConfig();

  try {
    const response = await fetch(`${url}/rest/v1/${table}?select=id${filter}`, {
      method: "HEAD",
      headers: {
        ...headers(),
        Prefer: "count=exact"
      },
      cache: "no-store"
    });

    if (!response.ok) return 0;
    return Number(response.headers.get("content-range")?.split("/")?.[1] ?? 0) || 0;
  } catch {
    return 0;
  }
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function listText(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(text).filter(Boolean).join("، ");
  }

  return text(value);
}

function ideaSupport(row: SupabaseRow): StudentIdea["support"] {
  if (row.needs_supervisor === true) return "مشرف";
  if (row.needs_team === true) return "فريق";
  return "جهة بحثية";
}

function mapIdea(row: SupabaseRow): StudentIdea {
  return {
    title: text(row.title) || "بدون عنوان",
    major: text(row.field) || text(row.major) || text(row.college) || "غير محدد",
    problem:
      text(row.research_problem) ||
      text(row.description) ||
      text(row.content) ||
      "لا توجد تفاصيل إضافية.",
    support: ideaSupport(row)
  };
}

function mapResearchProject(row: SupabaseRow): ResearchProject {
  return {
    title: text(row.title) || "بدون عنوان",
    field: text(row.field) || text(row.major) || text(row.college) || "غير محدد",
    researcher: text(row.owner_name) || text(row.reviewed_by) || "غير محدد",
    description:
      text(row.content) ||
      text(row.description) ||
      text(row.research_problem) ||
      "لا توجد تفاصيل إضافية."
  };
}

function mapOpportunity(row: SupabaseRow): Opportunity {
  return {
    title: text(row.title) || "بدون عنوان",
    faculty: text(row.faculty_name) || text(row.owner_name) || text(row.reviewed_by) || "غير محدد",
    department: text(row.department) || text(row.college) || "غير محدد",
    skills:
      listText(row.required_skills) ||
      text(row.content) ||
      text(row.description) ||
      "لا توجد تفاصيل إضافية.",
    status: "مفتوحة"
  };
}

// Public pages intentionally render approved rows; failed or empty reads render empty states.
export async function getPublicHomeData(): Promise<PublicHomeData> {
  const publishedFilter = "or=(status.eq.approved,status.eq.published)";
  const [ideaRows, opportunityRows, projectRows, stats] = await Promise.all([
    getRows(`student_research_ideas?select=*&${publishedFilter}&order=created_at.desc&limit=6`),
    getRows(`research_opportunities?select=*&${publishedFilter}&order=created_at.desc&limit=6`),
    getRows(`projects?select=*&${publishedFilter}&order=created_at.desc&limit=6`),
    getPublicPlatformStats()
  ]);

  return {
    researchProjects: projectRows.length ? projectRows.map(mapResearchProject) : ideaRows.map(mapResearchProject),
    opportunities: opportunityRows.map(mapOpportunity),
    ideas: ideaRows.map(mapIdea),
    stats
  };
}

export async function getPublicPlatformStats(): Promise<PlatformStats> {
  const publishedFilter = "&or=(status.eq.approved,status.eq.published)";
  const [publishedOpportunities, publishedIdeas, registeredBeneficiaries] = await Promise.all([
    getCount("research_opportunities", publishedFilter),
    getCount("student_research_ideas", publishedFilter),
    getCount("profiles", "&role=in.(student,faculty)")
  ]);

  return {
    publishedOpportunities,
    publishedIdeas,
    registeredBeneficiaries
  };
}
