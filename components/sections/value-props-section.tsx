import { getValueProps } from '@/data/value-props'

export async function ValuePropsSection() {
  const items = await getValueProps()

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="card-base p-5">
          <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
        </div>
      ))}
    </div>
  )
}
