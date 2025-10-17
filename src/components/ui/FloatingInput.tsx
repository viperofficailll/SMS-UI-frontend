import React, { useEffect, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface FloatingInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
  required?: boolean;
  textarea?: boolean;
  select?: boolean;
  options?: Option[];
  className?: string;
  error?: string;
  minLength?: number;
  maxLength?: number;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  textarea = false,
  select = false,
  options = [],
  className = "",
  error = "",
  minLength,
  maxLength,
}) => {
  const [localError, setLocalError] = useState<string>(error || "");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Normalize date format for HTML input type="date"
  const formattedValue =
    type === "date" && value ? new Date(value).toISOString().split("T")[0] : value ?? "";

  const validateRaw = (rawVal: string) => {
  const trimmed = rawVal.trim();

  if (required && trimmed.length === 0) {
    setLocalError(`${label} is required.`);
    return;
  }

  if (!required && type === "email" && trimmed.length > 0 && !emailRegex.test(trimmed)) {
    setLocalError(`Please enter a valid email address.`);
    return;
  }

  if (required && type === "email" && !emailRegex.test(trimmed)) {
    setLocalError(`Please enter a valid email address.`);
    return;
  }

  if (typeof minLength === "number" && trimmed.length > 0 && trimmed.length < minLength) {
    setLocalError(`${label} must be at least ${minLength} characters.`);
    return;
  }

  if (typeof maxLength === "number" && trimmed.length > maxLength) {
    setLocalError(`${label} must be at most ${maxLength} characters.`);
    return;
  }

  setLocalError("");
};


  useEffect(() => {
    setLocalError(error || "");
  }, [error]);

  useEffect(() => {
    validateRaw(value ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, minLength, maxLength, required]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const rawVal = e.target.value;
    onChange(e);
    validateRaw(rawVal);
  };

  const baseInputClasses =
    "peer w-full border rounded px-3 pt-6 pb-2 text-gray-900 placeholder-transparent focus:border-blue-600 focus:ring-0";
  const errorClasses = localError ? "border-red-500 focus:border-red-500" : "";
  const finalClass = `${baseInputClasses} ${errorClasses}`;

  // 🔧 Label positioning fix
  // For date & select, we always float the label to prevent overlap
  const forceFloatLabel = select || type === "date";
  const hasValue = (formattedValue ?? "").toString().length > 0;

  return (
    <div className={`relative mb-4 ${className}`}>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          value={formattedValue}
          onChange={handleChange}
          required={required}
          placeholder=" "
          minLength={minLength}
          maxLength={maxLength}
          className={`${finalClass} h-24`}
          aria-invalid={!!localError}
        />
      ) : select ? (
        <select
          id={name}
          name={name}
          value={formattedValue}
          onChange={handleChange}
          required={required}
          className={`${finalClass} h-12 bg-white appearance-none`}
          aria-invalid={!!localError}
        >
          <option value="" hidden>
            Select {label}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={formattedValue}
          onChange={handleChange}
          required={required}
          placeholder=" "
          minLength={minLength}
          maxLength={maxLength}
          className={`${finalClass} h-12`}
          aria-invalid={!!localError}
        />
      )}

      {/* 🔥 Label stays floated for date & select fields */}
      <label
        htmlFor={name}
        className={`absolute left-3 text-gray-500 bg-white px-1 transition-all duration-150 ease-in-out pointer-events-none
          ${
            hasValue || forceFloatLabel
              ? "text-xs top-1 text-blue-600"
              : "top-3.5 text-gray-400 text-sm peer-focus:text-xs peer-focus:top-1 peer-focus:text-blue-600"
          }`}
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {localError && (
        <p className="text-red-500 text-xs mt-1 transition-opacity duration-150 ease-in-out">
          {localError}
        </p>
      )}
    </div>
  );
};

export default FloatingInput;
