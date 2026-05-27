'use client';

import type { MouseEventHandler, ReactNode } from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'soft' | 'outline';

type ButtonLinkProps = {
  href?: string;
  children: ReactNode;
  variant?: ButtonVariant;
  external?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
};

export default function ButtonLink({
  href,
  children,
  variant = 'primary',
  external = false,
  onClick,
  type = 'button',
}: ButtonLinkProps) {
  const className = `button button-${variant}`;
  const opensNewTab = external || href?.startsWith('mailto:');

  if (!href) {
    return (
      <button className={className} type={type} onClick={onClick}>
        {children}
      </button>
    );
  }

  if (opensNewTab) {
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer" onClick={onClick}>
        {children}
      </a>
    );
  }

  if (href.startsWith('/')) {
    return (
      <Link className={className} href={href} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <a className={className} href={href} onClick={onClick}>
      {children}
    </a>
  );
}
