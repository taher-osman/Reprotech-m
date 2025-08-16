import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"
import { Eye, EyeOff, Search, X } from "lucide-react"

const inputVariants = cva(
  "flex w-full rounded-lg border bg-background text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input focus-visible:ring-ring",
        destructive: "border-destructive focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-green-500",
        warning: "border-warning focus-visible:ring-warning",
        ghost: "border-transparent bg-transparent focus-visible:ring-ring",
      },
      size: {
        sm: "h-8 px-3 py-1 text-xs",
        default: "h-10 px-3 py-2",
        lg: "h-12 px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  label?: string
  description?: string
  error?: string
  success?: string
  clearable?: boolean
  onClear?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    size, 
    type, 
    startIcon, 
    endIcon, 
    label, 
    description, 
    error, 
    success, 
    clearable,
    onClear,
    value,
    ...props 
  }, ref) => {
    const hasValue = value !== undefined && value !== ""
    const effectiveVariant = error ? "destructive" : success ? "success" : variant

    return (
      <div className="w-full">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {startIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant: effectiveVariant, size, className }),
              startIcon && "pl-10",
              (endIcon || clearable) && "pr-10"
            )}
            ref={ref}
            value={value}
            {...props}
          />
          {(endIcon || (clearable && hasValue)) && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {clearable && hasValue && onClear ? (
                <button
                  type="button"
                  onClick={onClear}
                  className="hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                endIcon
              )}
            </div>
          )}
        </div>
        {(description || error || success) && (
          <div className="mt-1.5">
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            {success && !error && (
              <p className="text-sm text-green-600">{success}</p>
            )}
            {description && !error && !success && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

// Search Input Component
interface SearchInputProps extends Omit<InputProps, "startIcon" | "type"> {
  onSearch?: (value: string) => void
  placeholder?: string
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, placeholder = "Search...", clearable = true, ...props }, ref) => {
    const [value, setValue] = React.useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setValue(newValue)
      onSearch?.(newValue)
    }

    const handleClear = () => {
      setValue("")
      onSearch?.("")
    }

    return (
      <Input
        ref={ref}
        type="search"
        placeholder={placeholder}
        startIcon={<Search className="h-4 w-4" />}
        value={value}
        onChange={handleChange}
        clearable={clearable}
        onClear={handleClear}
        {...props}
      />
    )
  }
)
SearchInput.displayName = "SearchInput"

// Password Input Component
interface PasswordInputProps extends Omit<InputProps, "type" | "endIcon"> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <Input
        ref={ref}
        type={showPassword ? "text" : "password"}
        endIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        }
        {...props}
      />
    )
  }
)
PasswordInput.displayName = "PasswordInput"

// Textarea Component
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  description?: string
  error?: string
  success?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, description, error, success, ...props }, ref) => {
    const hasError = !!error
    const hasSuccess = !!success

    return (
      <div className="w-full">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
            hasError && "border-destructive focus-visible:ring-destructive",
            hasSuccess && "border-green-500 focus-visible:ring-green-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {(description || error || success) && (
          <div className="mt-1.5">
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            {success && !error && (
              <p className="text-sm text-green-600">{success}</p>
            )}
            {description && !error && !success && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

// Select Component
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  description?: string
  error?: string
  success?: string
  placeholder?: string
  options: Array<{ value: string; label: string; disabled?: boolean }>
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, description, error, success, placeholder, options, ...props }, ref) => {
    const hasError = !!error
    const hasSuccess = !!success

    return (
      <div className="w-full">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
            {label}
          </label>
        )}
        <select
          className={cn(
            "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-background",
            hasError && "border-destructive focus:ring-destructive",
            hasSuccess && "border-green-500 focus:ring-green-500",
            className
          )}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        {(description || error || success) && (
          <div className="mt-1.5">
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            {success && !error && (
              <p className="text-sm text-green-600">{success}</p>
            )}
            {description && !error && !success && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)
Select.displayName = "Select"

export { Input, SearchInput, PasswordInput, Textarea, Select, inputVariants } 