import Link from 'next/link'

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="面包屑" className="text-sm text-muted-foreground">
      {items.map((it, i) => (
        <span key={i}>
          {it.href ? (
            <Link className="underline-offset-4 hover:underline" href={it.href}>
              {it.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-foreground">
              {it.label}
            </span>
          )}
          {i < items.length - 1 && <span className="mx-2">/</span>}
        </span>
      ))}
    </nav>
  )
}

