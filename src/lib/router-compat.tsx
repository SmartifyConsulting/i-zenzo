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
export function Link({ to, children, ...rest }: LinkProps) {
  if (/^(https?:|mailto:|tel:|#)/.test(to)) {
    return (
      <a href={to} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <RouterLink to={to as never} {...rest}>
      {children}
    </RouterLink>
  );
}

export function useLocation() {
  return useRouterState({ select: (s) => s.location });
}
