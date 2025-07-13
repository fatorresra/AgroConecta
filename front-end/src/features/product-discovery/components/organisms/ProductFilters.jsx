import { PRODUCT_FILTERS } from "@/shared/utils/options/productFilters"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProductFilters({ filters, onFilterChange, typeOptions }) {
  return (
    <div className="space-y-6">
      {Object.entries(PRODUCT_FILTERS).map(([key, config]) => {
        // Skip name filter as it's handled outside this component
        if (key === "name") return null;

        // Special handling for 'type' select
        if (config.type === "select") {
          return (
            <div key={key}>
              <Label className="text-base font-medium mb-3 block">{config.label}</Label>
              <Select
                value={filters[key]}
                onValueChange={value => onFilterChange(key, value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(key === "type" ? typeOptions : config.options || []).map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }
        // Range/slider (e.g., price)
        if (config.type === "range") {
          const [min, max] = filters[key] || [config.min, config.max];
          return (
            <div key={key}>
              <Label className="text-base font-medium mb-3 block">
                {config.label}: ${min.toLocaleString()} - ${max.toLocaleString()}
              </Label>
              <Slider
                value={filters[key]}
                onValueChange={value => onFilterChange(key, value)}
                max={config.max}
                min={config.min}
                step={config.step}
                className="w-full"
              />
            </div>
          );
        }
        // Other: number, text, date
        if (["number", "text", "date"].includes(config.type)) {
          return (
            <div key={key}>
              <Label className="text-base font-medium mb-3 block">{config.label}</Label>
              <input
                type={config.type}
                className="w-full border rounded px-3 py-2"
                value={filters[key]}
                onChange={e => onFilterChange(key, e.target.value)}
                placeholder={config.placeholder || ""}
              />
            </div>
          );
        }
        // Fallback (should not happen)
        return null;
      })}
    </div>
  );
}
