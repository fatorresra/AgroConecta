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
      {/* Type filter */}
      <div>
        <Label className="text-base font-medium mb-3 block">{PRODUCT_FILTERS.type.label}</Label>
        <Select
          value={filters.type}
          onValueChange={value => onFilterChange("type", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price filter */}
      <div>
        <Label className="text-base font-medium mb-3 block">
          {PRODUCT_FILTERS.price.label}: ${filters.price[0].toLocaleString()} - ${filters.price[1].toLocaleString()}
        </Label>
        <Slider
          value={filters.price}
          onValueChange={value => onFilterChange("price", value)}
          max={PRODUCT_FILTERS.price.max}
          min={PRODUCT_FILTERS.price.min}
          step={PRODUCT_FILTERS.price.step}
          className="w-full"
        />
      </div>

      {/* Quantity filter */}
      <div>
        <Label className="text-base font-medium mb-3 block">{PRODUCT_FILTERS.quantity.label}</Label>
        <input
          type="number"
          className="w-full border rounded px-3 py-2"
          value={filters.quantity}
          onChange={e => onFilterChange("quantity", e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="Ej: 10"
        />
      </div>
    </div>
  )
}
