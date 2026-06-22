import React from "react";

const labelCls =
  "block text-xs font-semibold text-gray-500 uppercase mb-1 tracking-wide";
const inputCls =
  "w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400";

interface FormInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  label: string;
  onChange: (value: string) => void;
}

export function FormInput({
  label,
  value,
  onChange,
  className = "",
  ...props
}: FormInputProps) {
  return (
    <div className={className}>
      <label className={labelCls}>{label}</label>
      <input
        className={inputCls}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </div>
  );
}

interface FormTextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange"
> {
  label: string;
  onChange: (value: string) => void;
}

export function FormTextarea({
  label,
  value,
  onChange,
  className = "",
  ...props
}: FormTextareaProps) {
  return (
    <div className={className}>
      <label className={labelCls}>{label}</label>
      <textarea
        className={`${inputCls} resize-none`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </div>
  );
}
