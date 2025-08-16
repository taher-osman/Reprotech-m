import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border",
        elevated: "border-border shadow-lg hover:shadow-xl",
        outlined: "border-2 border-border shadow-none",
        ghost: "border-transparent shadow-none bg-transparent",
        gradient: "border-border bg-gradient-to-br from-background to-muted/30",
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      hover: {
        none: "",
        lift: "hover:shadow-lg hover:-translate-y-1",
        glow: "hover:shadow-lg hover:shadow-primary/25",
        scale: "hover:scale-[1.02]",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      hover: "none",
    },
  }
)

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>
>(({ className, variant, size, hover, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant, size, hover, className }))}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    divided?: boolean
  }
>(({ className, divided = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5",
      divided && "pb-4 border-b border-border",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  }
>(({ className, as: Comp = "h3", ...props }, ref) => (
  <Comp
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-card-foreground",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    divided?: boolean
  }
>(({ className, divided = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex-1",
      divided && "pt-4 border-t border-border",
      className
    )}
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    divided?: boolean
  }
>(({ className, divided = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between",
      divided && "pt-4 border-t border-border",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Specialized Card Components
const StatCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string
    value: string | number
    description?: string
    icon?: React.ReactNode
    trend?: {
      value: number
      label: string
      direction: "up" | "down" | "neutral"
    }
    color?: "blue" | "green" | "purple" | "orange" | "red" | "teal"
  }
>(({ className, title, value, description, icon, trend, color = "blue", ...props }, ref) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    purple: "text-purple-600 bg-purple-50",
    orange: "text-orange-600 bg-orange-50",
    red: "text-red-600 bg-red-50",
    teal: "text-teal-600 bg-teal-50",
  }

  const trendColors = {
    up: "text-green-600 bg-green-50",
    down: "text-red-600 bg-red-50",
    neutral: "text-gray-600 bg-gray-50",
  }

  return (
    <Card ref={ref} className={cn("relative overflow-hidden", className)} hover="lift" {...props}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {trend && (
              <div className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2",
                trendColors[trend.direction]
              )}>
                <span className="mr-1">
                  {trend.direction === "up" ? "↗" : trend.direction === "down" ? "↘" : "→"}
                </span>
                {trend.value}% {trend.label}
              </div>
            )}
          </div>
          {icon && (
            <div className={cn("p-3 rounded-xl", colorClasses[color])}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
})
StatCard.displayName = "StatCard"

const FeatureCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string
    description: string
    icon?: React.ReactNode
    badge?: string
    action?: React.ReactNode
  }
>(({ className, title, description, icon, badge, action, ...props }, ref) => (
  <Card ref={ref} className={cn("group", className)} hover="lift" {...props}>
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary/20 transition-colors">
              {icon}
            </div>
          )}
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {badge && (
              <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mt-1">
                {badge}
              </span>
            )}
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <CardDescription className="leading-relaxed">{description}</CardDescription>
    </CardContent>
    {action && (
      <CardFooter>
        {action}
      </CardFooter>
    )}
  </Card>
))
FeatureCard.displayName = "FeatureCard"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  StatCard,
  FeatureCard,
  cardVariants,
} 