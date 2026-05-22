"use client";

import { useActionState, useMemo, useState } from "react";
import { signupAction } from "@/app/auth/actions";
import {
  academicLevels,
  academicRanks,
  facultyColleges,
  genders,
  getStudentMajors,
  studentColleges
} from "@/lib/auth/options";
import type { Gender, PublicRole } from "@/lib/auth/types";
import { FormField } from "@/components/auth/FormField";
import { SelectField } from "@/components/auth/SelectField";
import { SubmitButton } from "@/components/auth/SubmitButton";

const roleOptions: { label: string; value: PublicRole }[] = [
  { label: "طالب", value: "student" },
  { label: "عضو هيئة تدريس", value: "faculty" }
];

export function SignupForm() {
  const [state, formAction] = useActionState(signupAction, {});
  const [role, setRole] = useState<PublicRole>("student");
  const [gender, setGender] = useState<Gender | "">("");
  const [studentCollege, setStudentCollege] = useState("");
  const [facultyCollege, setFacultyCollege] = useState("");
  const [major, setMajor] = useState("");
  const [department, setDepartment] = useState("");

  const studentMajors = useMemo(
    () => getStudentMajors(studentCollege, gender),
    [studentCollege, gender]
  );

  const facultyDepartments = useMemo(() => {
    return facultyCollege
      ? [...(facultyColleges[facultyCollege as keyof typeof facultyColleges] ?? [])]
      : [];
  }, [facultyCollege]);

  function handleGenderChange(nextGender: string) {
    const typedGender = nextGender as Gender | "";
    setGender(typedGender);

    if (studentCollege === "كلية التمريض") {
      const nextMajors = getStudentMajors(studentCollege, typedGender);
      setMajor(nextMajors[0] ?? "");
    }
  }

  function handleStudentCollegeChange(nextCollege: string) {
    setStudentCollege(nextCollege);
    setMajor(getStudentMajors(nextCollege, gender)[0] ?? "");
  }

  function handleFacultyCollegeChange(nextCollege: string) {
    setFacultyCollege(nextCollege);
    setDepartment(facultyColleges[nextCollege as keyof typeof facultyColleges]?.[0] ?? "");
  }

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <div>
        <p className="mb-3 text-sm font-extrabold text-gold-light">اختر نوع الحساب</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {roleOptions.map((option) => (
            <label
              key={option.value}
              className={`cursor-pointer rounded-2xl border p-4 transition ${
                role === option.value
                  ? "border-gold bg-gold/15 text-gold-light"
                  : "border-gold/20 bg-navy/55 text-muted hover:border-gold/50"
              }`}
            >
              <input
                className="sr-only"
                type="radio"
                name="role"
                value={option.value}
                checked={role === option.value}
                onChange={() => setRole(option.value)}
                required
              />
              <span className="text-lg font-extrabold">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="الاسم الكامل"
          name="fullName"
          placeholder="اكتب اسمك الكامل"
          autoComplete="name"
          error={state.errors?.fullName}
        />
        <FormField
          label="البريد الإلكتروني الجامعي"
          name="email"
          type="email"
          placeholder={role === "student" ? "444100909@student.ksu.edu.sa" : "talselmi@ksu.edu.sa"}
          autoComplete="email"
          inputMode="email"
          error={state.errors?.email}
        />
        <FormField
          label="رقم الجوال"
          name="phoneNumber"
          type="tel"
          placeholder="05xxxxxxxx"
          autoComplete="tel"
          inputMode="tel"
          error={state.errors?.phoneNumber}
        />
        <FormField
          label="كلمة المرور"
          name="password"
          type="password"
          autoComplete="new-password"
          error={state.errors?.password}
        />
        <SelectField
          label="الجنس"
          name="gender"
          value={gender}
          onChange={handleGenderChange}
          options={genders}
          error={state.errors?.gender}
        />
      </div>

      {role === "student" ? (
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField
            label="الكلية"
            name="college"
            value={studentCollege}
            onChange={handleStudentCollegeChange}
            options={Object.keys(studentColleges)}
            error={state.errors?.college}
          />
          <SelectField
            label="التخصص"
            name="major"
            value={major}
            onChange={setMajor}
            options={studentMajors}
            error={state.errors?.major}
          />
          <SelectField
            label="المستوى الدراسي"
            name="academicLevel"
            options={academicLevels}
            error={state.errors?.academicLevel}
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField
            label="الكلية"
            name="college"
            value={facultyCollege}
            onChange={handleFacultyCollegeChange}
            options={Object.keys(facultyColleges)}
            error={state.errors?.college}
          />
          <SelectField
            label="القسم"
            name="department"
            value={department}
            onChange={setDepartment}
            options={facultyDepartments}
            error={state.errors?.department}
          />
          <SelectField
            label="المرتبة الأكاديمية"
            name="academicRank"
            options={academicRanks}
            error={state.errors?.academicRank}
          />
        </div>
      )}

      {state.message && (!state.errors || Object.keys(state.errors).length === 0) ? (
        <p className="rounded-2xl border border-red-300/30 bg-red-950/25 px-4 py-3 text-sm font-bold text-red-100">
          {state.message}
        </p>
      ) : null}

      <SubmitButton pendingText="جاري إنشاء الحساب">إنشاء حساب</SubmitButton>
    </form>
  );
}
