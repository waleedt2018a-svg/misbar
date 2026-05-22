type SelectFieldProps = {
  label: string;
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  error?: string;
};

export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "اختر",
  required = true,
  error
}: SelectFieldProps) {
  const errorId = `${name}-error`;

  function handleValueChange(event: React.ChangeEvent<HTMLSelectElement>) {
    onChange?.(event.target.value);
  }

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-ivory">{label}</span>
      <select
        name={name}
        value={value}
        onChange={handleValueChange}
        onInput={handleValueChange}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-2xl border bg-navy/70 px-4 py-3 text-ivory outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10 ${
          error ? "border-red-300/60" : "border-gold/20"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} className="mt-2 text-sm font-bold text-red-100">
          {error}
        </p>
      ) : null}
    </label>
  );
}
