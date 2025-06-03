import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AuthInput({
  id,
  label,
  type = "text",
  icon: Icon,
  rightIcon: RightIcon,
  className = "",
  ...props
}) {
  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />}
        <Input
          id={id}
          type={type}
          className={`${Icon ? "pl-10" : ""} ${RightIcon ? "pr-10" : ""} ${className}`}
          {...props}
        />
        {RightIcon && (
          <div className="absolute right-3 top-3 text-gray-400">
            {RightIcon}
          </div>
        )}
      </div>
    </div>
  )
}
