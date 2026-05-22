type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  error?: string;
};

export function FormField({
  label,
  name,
  type = "text",
  required = true,
  placeholder,
  autoComplete,
  inputMode,
  error
}: FormFieldProps) {
  const errorId = `${name}-error`;

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-ivory">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-2xl border bg-navy/70 px-4 py-3 text-ivory outline-none transition placeholder:text-muted/55 focus:border-gold focus:ring-4 focus:ring-gold/10 ${
          error ? "border-red-300/60" : "border-gold/20"
        }`}
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm font-bold text-red-100">
          {error}
        </p>
      ) : null}
    </label>
  );
}
