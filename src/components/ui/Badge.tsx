import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"
import { X } from "lucide-react"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        success: "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning: "border-transparent bg-warning text-warning-foreground hover:bg-warning/80",
        info: "border-transparent bg-info text-info-foreground hover:bg-info/80",
        outline: "text-foreground border-border bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "px-1.5 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dismissible?: boolean
  onDismiss?: () => void
  icon?: React.ReactNode
}

function Badge({ 
  className, 
  variant, 
  size, 
  dismissible = false, 
  onDismiss, 
  icon, 
  children, 
  ...props 
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-1.5 -mr-1 hover:bg-black/20 hover:text-white rounded-full p-0.5 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

// Status Badge Component
interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  status: "active" | "inactive" | "pending" | "completed" | "failed" | "warning" | "info"
}

function StatusBadge({ status, ...props }: StatusBadgeProps) {
  const statusConfig = {
    active: { variant: "success" as const, text: "Active" },
    inactive: { variant: "secondary" as const, text: "Inactive" },
    pending: { variant: "warning" as const, text: "Pending" },
    completed: { variant: "success" as const, text: "Completed" },
    failed: { variant: "destructive" as const, text: "Failed" },
    warning: { variant: "warning" as const, text: "Warning" },
    info: { variant: "info" as const, text: "Info" },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} {...props}>
      {config.text}
    </Badge>
  )
}

// Priority Badge Component
interface PriorityBadgeProps extends Omit<BadgeProps, "variant"> {
  priority: "low" | "medium" | "high" | "critical"
}

function PriorityBadge({ priority, ...props }: PriorityBadgeProps) {
  const priorityConfig = {
    low: { variant: "secondary" as const, text: "Low" },
    medium: { variant: "warning" as const, text: "Medium" },
    high: { variant: "info" as const, text: "High" },
    critical: { variant: "destructive" as const, text: "Critical" },
  }

  const config = priorityConfig[priority]

  return (
    <Badge variant={config.variant} {...props}>
      {config.text}
    </Badge>
  )
}

// Count Badge Component
interface CountBadgeProps extends Omit<BadgeProps, "children"> {
  count: number
  max?: number
  showZero?: boolean
}

function CountBadge({ count, max = 99, showZero = false, ...props }: CountBadgeProps) {
  if (count === 0 && !showZero) return null

  const displayCount = count > max ? `${max}+` : count

  return (
    <Badge variant="destructive" size="sm" {...props}>
      {displayCount}
    </Badge>
  )
}

// Module Badge Component
interface ModuleBadgeProps extends Omit<BadgeProps, "variant"> {
  module: "phase-1" | "phase-2" | "phase-3" | "phase-4" | "phase-5" | "new" | "hot" | "updated" | "beta" | "live" | "LIVE" | "coming-soon" | string
}

function ModuleBadge({ module, ...props }: ModuleBadgeProps) {
  const moduleConfig = {
    "phase-1": { variant: "info" as const, text: "PHASE 1" },
    "phase-2": { variant: "info" as const, text: "PHASE 2" },
    "phase-3": { variant: "info" as const, text: "PHASE 3" },
    "phase-4": { variant: "info" as const, text: "PHASE 4" },
    "phase-5": { variant: "info" as const, text: "PHASE 5" },
    new: { variant: "success" as const, text: "NEW" },
    hot: { variant: "destructive" as const, text: "HOT" },
    updated: { variant: "warning" as const, text: "UPDATED" },
    beta: { variant: "secondary" as const, text: "BETA" },
    live: { variant: "success" as const, text: "LIVE" },
    "LIVE": { variant: "success" as const, text: "LIVE" },
    "coming-soon": { variant: "warning" as const, text: "COMING SOON" },
    "COMING SOON": { variant: "warning" as const, text: "COMING SOON" },
  }

  const config = moduleConfig[module]
  
  // Fallback for unknown module types
  if (!config) {
    console.warn(`ModuleBadge: Unknown module type "${module}". Using default configuration.`)
    return (
      <Badge variant="secondary" size="sm" {...props}>
        {module.toUpperCase()}
      </Badge>
    )
  }

  return (
    <Badge variant={config.variant} size="sm" {...props}>
      {config.text}
    </Badge>
  )
}

export { Badge, StatusBadge, PriorityBadge, CountBadge, ModuleBadge, badgeVariants } 