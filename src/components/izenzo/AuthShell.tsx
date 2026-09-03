import { useState, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { Logo } from "@/components/izenzo/Logo";
import { MeshBackground } from "@/components/izenzo/ui";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-card">
      <MeshBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
      <header className="relative z-10 max-w-[1280px] mx-auto w-full px-4 sm:px-6 h-20 flex items-center">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <Logo />
          <span className="ml-2">Back to Izenzo home</span>
        </Link>
      </header>
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-md border border-border bg-card shadow-lg p-8">{children}</div>
      </div>
    </div>
  );
}

export function TextField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        {...(onChange ? { value: value ?? "", onChange: (e) => onChange(e.target.value) } : {})}
        className="w-full h-11 rounded-md border border-border px-3 text-sm outline-none focus:border-emerald-brand"
      />
    </div>
  );
}

export function PasswordField({
  label,
  placeholder,
  action,
  value,
  onChange,
  required,
}: {
  label: string;
  placeholder?: string;
  action?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        {action}
      </div>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          required={required}
          {...(onChange ? { value: value ?? "", onChange: (e) => onChange(e.target.value) } : {})}
          className="w-full h-11 rounded-md border border-border pl-3 pr-11 text-sm outline-none focus:border-emerald-brand"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded text-muted-foreground hover:text-foreground"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

export function SubmitButton({ children, disabled }: { children: ReactNode; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full h-11 rounded-md bg-emerald-brand text-primary-foreground text-sm font-semibold hover:bg-emerald-bright transition-colors disabled:opacity-60"
    >
      {children}
    </button>
  );
}
