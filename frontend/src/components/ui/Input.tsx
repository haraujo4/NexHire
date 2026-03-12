import { InputHTMLAttributes, forwardRef } from "react"
import { cn } from "../../lib/utils"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <div className="w-full">
                <input
                    ref={ref}
                    className={cn(
                        "flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-[var(--color-danger)] focus:ring-[var(--color-danger)]",
                        className
                    )}
                    {...props}
                />
                {error && <span className="text-[var(--color-danger)] text-sm mt-1">{error}</span>}
            </div>
        )
    }
)
Input.displayName = "Input"
