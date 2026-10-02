"use client";

interface PageHeaderProps {
  title: string;
  subtitle?: string;

  //optional button/element rendered on the rightside
  action?: React.ReactNode;

  variant?: "inline" | "banner";
}

export  function PageHeader({
  title,
  subtitle,
  action,
  variant = "inline",
}: PageHeaderProps) {
  if (variant == "banner") {
    return (
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-page-title text-slate-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-page-title text-[#0A0A0A]"> {title}</h1>
        {subtitle && (
          <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
