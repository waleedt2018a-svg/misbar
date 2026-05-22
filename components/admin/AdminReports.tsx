"use client";

import { useState } from "react";
import { adminReports } from "@/data/admin";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import type { AdminReport, ReportStatus } from "@/lib/admin/types";

const actions: ReportStatus[] = ["open", "under_review", "resolved", "dismissed"];

export function AdminReports() {
  const [reports, setReports] = useState<AdminReport[]>(adminReports);

  function updateStatus(id: string, status: ReportStatus) {
    setReports((current) => current.map((report) => (report.id === id ? { ...report, status } : report)));
  }

  return (
    <div className="grid gap-5">
      {reports.map((report) => (
        <AdminCard key={report.id}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <AdminStatusBadge status={report.status} />
              <h3 className="mt-4 text-2xl font-extrabold text-ivory">{report.reason}</h3>
              <p className="mt-2 text-sm text-muted">{report.reportedTarget}</p>
            </div>
            <p className="text-sm text-muted">{report.createdAt}</p>
          </div>
          <div className="mt-5 grid gap-3 text-sm leading-7 text-muted md:grid-cols-2">
            <p><span className="font-bold text-ivory">المبلّغ: </span>{report.reporter}</p>
            <p><span className="font-bold text-ivory">المحتوى/المستخدم المبلّغ عنه: </span>{report.reportedTarget}</p>
          </div>
          <p className="mt-3 leading-8 text-muted">{report.details}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {actions.map((status) => (
              <button key={status} onClick={() => updateStatus(report.id, status)} className="rounded-full border border-gold/35 px-4 py-2 text-sm font-extrabold text-ivory">
                {status}
              </button>
            ))}
          </div>
        </AdminCard>
      ))}
    </div>
  );
}
