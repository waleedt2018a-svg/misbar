const footerLinks = [
  "الرئيسية",
  "المشاريع البحثية",
  "فرص الطلاب",
  "مجلة مِسبار الطلابية",
  "Paper Lab",
  "من نحن"
];

export function Footer() {
  return (
    <footer id="footer" className="mt-12 border-t border-gold/15 px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-2xl font-extrabold text-ivory">مِسبار — حيث يُصنع الباحثون</p>
          <p className="mt-3 max-w-xl leading-8 text-muted">
            منصة بحثية طلابية تجمع المشاريع والفرص والأفكار والمخرجات العلمية في تجربة واحدة.
          </p>
        </div>
        <div>
          <p className="mb-4 font-extrabold text-gold-light">روابط سريعة:</p>
          <div className="flex max-w-xl flex-wrap gap-x-5 gap-y-3 text-sm text-muted">
            {footerLinks.map((link) => (
              <a key={link} href="#" className="transition hover:text-gold-light">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
