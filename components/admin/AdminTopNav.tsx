interface AdminTopNavProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function AdminTopNav({ title, subtitle, children }: AdminTopNavProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </header>
  );
}
