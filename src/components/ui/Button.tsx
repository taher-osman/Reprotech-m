import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-green-500 text-white hover:bg-green-600 shadow-sm",
        warning: "bg-warning text-warning-foreground hover:bg-warning/80 shadow-sm",
        info: "bg-info text-info-foreground hover:bg-info/80 shadow-sm",
        gradient: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-lg",
      },
      size: {
        sm: "h-8 rounded-md px-3 text-xs",
        default: "h-10 px-4 py-2",
        lg: "h-12 rounded-lg px-6 text-base",
        xl: "h-14 rounded-lg px-8 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
      animation: {
        none: "",
        bounce: "hover:scale-105 active:scale-95",
        pulse: "hover:animate-pulse",
        wiggle: "hover:animate-bounce",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "bounce",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation,
    asChild = false, 
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || loading

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, animation, className }),
          fullWidth && "w-full",
          loading && "cursor-not-allowed"
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!loading && leftIcon && (
          <span className="mr-2">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

// Icon Button Component
interface IconButtonProps extends Omit<ButtonProps, "leftIcon" | "rightIcon" | "children"> {
  icon: React.ReactNode
  "aria-label": string
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, size = "icon", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size={size}
        className={className}
        {...props}
      >
        {icon}
      </Button>
    )
  }
)
IconButton.displayName = "IconButton"

// Button Group Component
interface ButtonGroupProps {
  children: React.ReactNode
  variant?: "attached" | "separated"
  size?: "sm" | "default" | "lg"
  className?: string
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  variant = "attached",
  size = "default",
  className,
}) => {
  const childrenArray = React.Children.toArray(children)

  if (variant === "separated") {
    return (
      <div className={cn("flex gap-2", className)}>
        {children}
      </div>
    )
  }

  return (
    <div className={cn("flex rounded-lg", className)} role="group">
      {childrenArray.map((child, index) => {
        if (React.isValidElement(child)) {
          const isFirst = index === 0
          const isLast = index === childrenArray.length - 1
          const isMiddle = !isFirst && !isLast

          return React.cloneElement(child, {
            key: index,
            className: cn(
              child.props.className,
              "rounded-none border-r-0 focus:z-10",
              isFirst && "rounded-l-lg",
              isLast && "rounded-r-lg border-r",
              isMiddle && "border-r-0"
            ),
            size: child.props.size || size,
          } as any)
        }
        return child
      })}
    </div>
  )
}

// Action Button Component (with confirmation)
interface ActionButtonProps extends ButtonProps {
  onConfirm?: () => void | Promise<void>
  confirmText?: string
  requiresConfirmation?: boolean
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ 
    onConfirm, 
    confirmText = "Are you sure?", 
    requiresConfirmation = false,
    onClick,
    ...props 
  }, ref) => {
    const [showConfirmation, setShowConfirmation] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (requiresConfirmation && !showConfirmation) {
        e.preventDefault()
        setShowConfirmation(true)
        return
      }

      if (onConfirm) {
        setIsLoading(true)
        try {
          await onConfirm()
        } finally {
          setIsLoading(false)
          setShowConfirmation(false)
        }
      } else if (onClick) {
        onClick(e)
      }
    }

    const handleCancel = () => {
      setShowConfirmation(false)
    }

    if (showConfirmation) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{confirmText}</span>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleClick}
            loading={isLoading}
          >
            Yes
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            No
          </Button>
        </div>
      )
    }

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        loading={isLoading}
        {...props}
      />
    )
  }
)
ActionButton.displayName = "ActionButton"

export { Button, IconButton, ButtonGroup, ActionButton, buttonVariants } 