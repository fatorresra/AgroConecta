import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import ProductBasicInfo from "./ProductBasicInfo"
import ProductPricing from "./ProductPricing"
import ProductImage from "../atoms/ProductImage"

export default function ProductFormModal({ 
  open, 
  onOpenChange, 
  onSave, 
  isEdit = false, 
  producto = null,
  title = isEdit ? "Editar Producto" : "Publicar Nuevo Producto",
  description = isEdit 
    ? "Modifica la información de tu producto"
    : "Completa la información de tu producto para publicarlo en la plataforma"
}) {  const [formData, setFormData] = useState(producto || {})
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    // Aquí iría la validación
    const validationErrors = {}
    if (!formData.nombre) validationErrors.nombre = "El nombre es requerido"
    if (!formData.categoria) validationErrors.categoria = "La categoría es requerida"
    if (!formData.precio) validationErrors.precio = "El precio es requerido"
    if (!formData.unidad) validationErrors.unidad = "La unidad es requerida"

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    await onSave(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <ProductBasicInfo 
            producto={producto} 
            onChange={handleChange}
            errors={errors}
          />

          <ProductPricing 
            producto={producto} 
            onChange={handleChange}
            errors={errors}
          />

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea 
              id="descripcion" 
              placeholder="Describe tu producto, su calidad, proceso de cultivo, etc." 
              defaultValue={producto?.descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
              className={errors.descripcion ? "border-red-500" : ""}
            />
            {errors.descripcion && (
              <p className="text-xs text-red-500">{errors.descripcion}</p>
            )}
          </div>

          {!isEdit && (
            <div className="space-y-2">
              <Label>Imágenes del Producto</Label>
              <ProductImage 
                onChange={(e) => handleChange("imagenes", Array.from(e.target.files))}
              />
              {errors.imagenes && (
                <p className="text-xs text-red-500">{errors.imagenes}</p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700" 
            onClick={handleSubmit}
          >
            {isEdit ? "Guardar Cambios" : "Publicar Producto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
