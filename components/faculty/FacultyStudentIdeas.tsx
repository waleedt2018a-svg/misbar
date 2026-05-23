"use client";

import { useEffect, useState } from "react";
import { FacultyBlockedFeatureNotice } from "@/components/faculty/FacultyBlockedFeatureNotice";
import { FacultyCard } from "@/components/faculty/FacultyCard";
import { FacultyEmptyState } from "@/components/faculty/FacultyEmptyState";
import { FacultyStatusBadge } from "@/components/faculty/FacultyStatusBadge";
import {
  getFacultyAcademicProfile,
  getFacultyStudentIdeas,
  saveFacultyStudentIdeas
} from "@/lib/faculty/storage";
import type { FacultyStudentIdea } from "@/lib/faculty/types";

export function FacultyStudentIdeas() {
  const [ideas, setIdeas] = useState<FacultyStudentIdea[]>([]);
  const [blocked, setBlocked] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setIdeas(getFacultyStudentIdeas());
  }, []);

  function expressInterest(id: string) {
    const profile = getFacultyAcademicProfile();

    if (!profile.isComplete) {
      setBlocked(true);
      setMessage("");
      return;
    }

    const nextIdeas = ideas.map((idea) =>
      idea.id === id ? { ...idea, interestStatus: "قيد المراجعة" as const } : idea
    );

    setIdeas(nextIdeas);
    saveFacultyStudentIdeas(nextIdeas);
    setBlocked(false);
    setMessage("تم إرسال اهتمامك بالإشراف، ولن تظهر بيانات التواصل حتى يقبل الطالب الاهتمام.");
  }

  if (!ideas.length) {
    return <FacultyEmptyState message="لا توجد أفكار طلابية مناسبة حاليًا" />;
  }

  return (
    <div className="grid gap-5">
      {blocked ? <FacultyBlockedFeatureNotice /> : null}
      {message ? (
        <p className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm font-bold text-gold">
          {message}
        </p>
      ) : null}
      {ideas.map((idea) => (
        <FacultyCard key={idea.id}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              {idea.interestStatus ? <FacultyStatusBadge status={idea.interestStatus} /> : null}
              <h3 className="mt-4 text-2xl font-extrabold leading-9 text-ivory">{idea.title}</h3>
              <p className="mt-2 text-sm font-bold text-gold">{idea.studentName}</p>
            </div>
            <button
              type="button"
              onClick={() => expressInterest(idea.id)}
              className="rounded-full bg-gold px-5 py-2.5 text-sm font-extrabold text-navy shadow-glow transition hover:bg-gold-light"
            >
              إبداء الاهتمام بالإشراف
            </button>
          </div>
          <div className="mt-5 grid gap-3 text-sm leading-7 text-muted md:grid-cols-3">
            <p><span className="font-bold text-ivory">الكلية: </span>{idea.college}</p>
            <p><span className="font-bold text-ivory">التخصص: </span>{idea.major}</p>
            <p><span className="font-bold text-ivory">المجال البحثي: </span>{idea.field}</p>
            <p><span className="font-bold text-ivory">تحتاج مشرف؟ </span>{idea.needsSupervisor ? "نعم" : "لا"}</p>
            <p><span className="font-bold text-ivory">تحتاج فريق؟ </span>{idea.needsTeam ? "نعم" : "لا"}</p>
            <p><span className="font-bold text-ivory">المهارات المطلوبة: </span>{idea.requiredSkills.join("، ")}</p>
          </div>
          <p className="mt-4 leading-8 text-muted"><span className="font-bold text-ivory">المشكلة البحثية: </span>{idea.researchProblem}</p>
          <p className="mt-3 leading-8 text-muted">{idea.description}</p>
        </FacultyCard>
      ))}
    </div>
  );
}
