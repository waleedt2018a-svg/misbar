import Link from "next/link";

type BlockedFeatureNoticeProps = {
  message: string;
};

export function BlockedFeatureNotice({ message }: BlockedFeatureNoticeProps) {
  return (
    <div className="rounded-3xl border border-gold/30 bg-gold/10 p-5">
      <p className="font-bold leading-8 text-gold-light">{message}</p>
      <Link
        href="/student/profile"
        className="mt-4 inline-flex rounded-full bg-gold px-5 py-2.5 text-sm font-extrabold text-navy transition hover:bg-gold-light"
      >
        إكمال الملف البحثي
      </Link>
    </div>
  );
}
