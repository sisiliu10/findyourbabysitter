"use client";

import { useState, forwardRef } from "react";
import { cn } from "@/lib/utils";
import type { InputProps } from "./Input";

const EyeIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

/**
 * Drop-in replacement for <Input type="password"> with show/hide toggle.
 * Accepts all InputProps — label, error, className, etc.
 */
const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, "type">>(
  ({ label, error, className, id, ...props }, ref) => {
    const [show, setShow] = useState(false);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={show ? "text" : "password"}
            className={cn(
              "block w-full border bg-transparent px-3 py-2.5 pr-10 text-sm text-text-primary",
              "placeholder:text-text-muted",
              "transition-colors duration-150",
              "focus:outline-none focus:border-text-primary",
              "disabled:cursor-not-allowed disabled:opacity-40",
              error ? "border-danger focus:border-danger" : "border-border-default",
              className,
            )}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-text-muted hover:text-text-secondary transition-colors"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-xs text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
