import { motion } from "framer-motion";

const EXAMPLES = [
  { label: "React", value: "facebook/react" },
  { label: "Next.js", value: "vercel/next.js" },
  { label: "Express", value: "expressjs/express" },
  { label: "Tailwind CSS", value: "tailwindlabs/tailwindcss" },
  { label: "Shadcn UI", value: "shadcn-ui/ui" },
];

interface ExampleReposProps {
  onSelect: (value: string) => void;
}

export function ExampleRepos({ onSelect }: ExampleReposProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center items-center">
      <span className="text-sm text-muted-foreground/70 mr-1">Try:</span>
      {EXAMPLES.map((ex, i) => (
        <motion.button
          key={ex.value}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 + i * 0.06 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(ex.value)}
          className="px-4 py-1.5 rounded-full text-xs font-medium border border-border/50 bg-secondary/50 text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 cursor-pointer hover:shadow-sm hover:shadow-primary/10"
        >
          {ex.label}
        </motion.button>
      ))}
    </div>
  );
}
