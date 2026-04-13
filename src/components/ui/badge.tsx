import { cn } from "@/lib/cn";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success" | "warning";
  className?: string;
}) {
  const variants = {
    default: "bg-primary/20 text-primary",
    accent: "bg-accent/20 text-accent",
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
