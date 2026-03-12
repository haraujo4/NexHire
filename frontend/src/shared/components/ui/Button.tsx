import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
    size?: 'sm' | 'md' | 'lg' | 'icon'
    isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

        const variants = {
            primary: "bg-[var(--color-primary)] text-white hover:bg-blue-700",
            secondary: "border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-blue-50",
            ghost: "text-gray-700 hover:bg-gray-100",
            danger: "bg-[var(--color-danger)] text-white hover:bg-red-600",
            outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100"
        }

        const sizes = {
            sm: "h-9 px-3 text-sm",
            md: "h-11 px-4 text-base",
            lg: "h-14 px-8 text-lg",
            icon: "h-9 w-9 p-0"
        }

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                )}
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"
