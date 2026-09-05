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
      <header className="relative z-10 max-w-[1280px] mx-auto w-full px-4 sm:px-6 h-20 flex items-center gap-2 text-sm text-muted-foreground">
        <Logo />
        <Link to="/" className="hover:text-foreground">
          Back to Izenzo home
        </Link>
      </header>
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-md border border-border bg-card shadow-lg p-8">{children}</div>
      </div>
    </div>
  );
}

const fieldLabel = "text-[11px] font-semibold tracking-[0.12em] uppercase text-muted-foreground";

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
      <label className={`${fieldLabel} mb-1 block`}>{label}</label>
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
        <label className={fieldLabel}>{label}</label>
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
          tabIndex={-1}
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

function MicrosoftMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="0" y="0" width="7" height="7" fill="#F25022" />
      <rect x="9" y="0" width="7" height="7" fill="#7FBA00" />
      <rect x="0" y="9" width="7" height="7" fill="#00A4EF" />
      <rect x="9" y="9" width="7" height="7" fill="#FFB900" />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.1 24.6c0-1.6-.1-3.2-.4-4.6H24v9.1h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.2 5.6c4.2-3.9 7.1-9.6 7.1-17z"
      />
      <path fill="#FBBC05" d="M10.4 28.7a14.6 14.6 0 0 1 0-9.4l-7.8-6.1a24 24 0 0 0 0 21.6l7.8-6.1z" />
      <path
        fill="#34A853"
        d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.2-5.6c-2 1.4-4.6 2.2-8.7 2.2-6.4 0-11.7-3.7-13.6-9.1l-7.8 6.1C6.5 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}

export function SocialSignIn({ onUnavailable }: { onUnavailable: () => void }) {
  const cls =
    "w-full h-11 rounded-md border border-border bg-card text-sm font-medium text-foreground flex items-center justify-center gap-2.5 hover:bg-muted transition-colors";
  return (
    <div className="space-y-3">
      <button type="button" className={cls} onClick={onUnavailable}>
        <MicrosoftMark />
        Continue with Microsoft
      </button>
      <button type="button" className={cls} onClick={onUnavailable}>
        <GoogleMark />
        Continue with Google
      </button>
      <div className="flex items-center gap-3 py-1">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground">OR</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}
