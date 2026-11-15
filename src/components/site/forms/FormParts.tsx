import { forwardRef, type ElementRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function FieldShell({
  id,
  label,
  error,
  required,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  required?: boolean | undefined;
  hint?: string | undefined;
  className?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
        {required ? <span className="ml-0.5 text-gold" aria-hidden>*</span> : <span className="ml-1.5 font-normal text-night-muted">(optional)</span>}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            key="err"
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 flex items-center gap-1.5 text-xs text-danger"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
          </motion.p>
        ) : hint ? (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-night-muted">{hint}</p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

type Invalid = { invalid?: boolean | undefined };

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & Invalid>(
  ({ invalid, className, id, ...props }, ref) => (
    <input
      ref={ref}
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={cn("field-control", className)}
      {...props}
    />
  ),
);
TextInput.displayName = "TextInput";

export const SelectInput = forwardRef<
  ElementRef<typeof SelectTrigger>,
  Invalid & {
    id: string;
    name?: string;
    value?: string;
    onValueChange: (value: string) => void;
    onBlur?: () => void;
    options: readonly string[];
    placeholder: string;
    className?: string;
  }
>(({ invalid, className, id, name, value, onValueChange, onBlur, options, placeholder }, ref) => (
  <Select name={name} value={value || undefined} onValueChange={onValueChange}>
    <SelectTrigger
      ref={ref}
      id={id}
      onBlur={onBlur}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={cn("field-control h-auto cursor-pointer justify-between rounded-[0.875rem] px-4 py-[0.85rem] text-[0.95rem] shadow-none focus:ring-0 focus:ring-offset-0", className)}
    >
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent
      position="popper"
      className="z-[100] rounded-[0.875rem] border border-gold/50 bg-night-2 p-1 text-night-foreground shadow-[0_12px_36px_-12px_rgba(0,0,0,0.7)] data-[side=bottom]:translate-y-0"
    >
      {options.map((option) => (
        <SelectItem
          key={option}
          value={option}
          className="cursor-pointer rounded-lg px-3 py-2 text-[0.95rem] text-night-foreground focus:bg-night focus:text-night-foreground"
        >
          {option}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
));
SelectInput.displayName = "SelectInput";

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & Invalid>(
  ({ invalid, className, id, ...props }, ref) => (
    <textarea
      ref={ref}
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={cn("field-control min-h-32 resize-y", className)}
      {...props}
    />
  ),
);
TextArea.displayName = "TextArea";

/** Off-screen field that only bots fill in. */
export function Honeypot(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" tabIndex={-1} autoComplete="off" {...props} />
      </label>
    </div>
  );
}
