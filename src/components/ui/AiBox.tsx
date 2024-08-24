import { cn } from "@/lib/utils";

interface AiBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
}

function AiBox({ className, text, ...props }: AiBoxProps) {
  return (
    <div className={cn("rounded-md bg-muted text-black p-2 m-2", className)} {...props}>
      <h3>{text}</h3>
    </div>
  );
}

export { AiBox };
