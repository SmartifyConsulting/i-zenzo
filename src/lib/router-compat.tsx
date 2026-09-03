import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link as RouterLink, useRouterState } from "@tanstack/react-router";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  children?: ReactNode;
};

/**
 * Thin compatibility wrapper so ported page components can use a plain
 * string `to` prop while still routing through TanStack Router.
 */
const AnyRouterLink = RouterLink as unknown as (props: Record<string, unknown>) => ReactNode;

export function Link({ to, children, ...rest }: LinkProps) {
  if (/^(https?:|mailto:|tel:|#)/.test(to)) {
    return (
      <a href={to} {...rest}>
        {children}
      </a>
    );
  }
  return AnyRouterLink({ to, ...rest, children });
}

export function useLocation() {
  return useRouterState({ select: (s) => s.location });
}
