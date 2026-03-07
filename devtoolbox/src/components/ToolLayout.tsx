export default function ToolLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-muted">{description}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div>{children}</div>
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-lg border border-dashed border-card-border bg-card p-6 text-center text-sm text-muted">
            広告スペース
            <br />
            Google AdSense
          </div>
        </aside>
      </div>
    </div>
  );
}
