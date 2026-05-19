import Link from 'next/link';

export default function ButtonLink({ href, children, variant = 'primary', external = false, onClick, type = 'button' }) {
  const className = `button button-${variant}`;

  if (!href) {
    return (
      <button className={className} type={type} onClick={onClick}>
        {children}
      </button>
    );
  }

  if (external) {
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
