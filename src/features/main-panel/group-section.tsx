import { cn } from "@/lib/utils";

type Props = {
  title: string;
  titleClassName?: string;
  children: React.ReactNode;
};

export function GroupSection({ title, titleClassName, children }: Props) {
  return (
    <div className="mb-4">
      <h3 className={cn("text-muted-foreground px-4 py-1 text-xs font-semibold tracking-wide uppercase", titleClassName)}>{title}</h3>
      {children}
    </div>
  );
}
