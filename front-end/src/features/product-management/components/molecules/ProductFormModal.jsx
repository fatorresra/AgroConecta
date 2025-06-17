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
}) {    const [formData, setFormData] = useState(() => {
    if (!producto) return {
      name: '',
      type: '',
      price_per_unit: '',
      quantity: '',
      description: '',
      harvest_date: ''
    };

    // Si tenemos un producto, aseguramos los tipos de datos correctos
    return {
      name: producto.name || '',
      type: producto.type || '',
      price_per_unit: producto.price_per_unit?.toString() || '',
      quantity: producto.quantity?.toString() || '',
      description: producto.description || '',
      harvest_date: producto.harvest_date ? new Date(producto.harvest_date).toISOString().split('T')[0] : ''
    };
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const validationErrors = {}
    if (!formData.name) validationErrors.name = "El nombre es requerido"
    if (!formData.type) validationErrors.type = "La categoría es requerida"
    if (!formData.price_per_unit) validationErrors.price_per_unit = "El precio es requerido"
    if (!formData.quantity) validationErrors.quantity = "La cantidad es requerida"
    if (!formData.harvest_date) validationErrors.harvest_date = "La fecha de cosecha es requerida"

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setIsSubmitting(false)
      return
    }    try {
      // Formatear los datos antes de enviar
      const dataToSend = {
        ...formData,
        price_per_unit: Number(formData.price_per_unit),
        quantity: Number(formData.quantity),
        // Convertir la fecha a formato ISO 8601
        harvest_date: formData.harvest_date ? new Date(formData.harvest_date).toISOString() : null
      };

      console.log('Sending data:', dataToSend); // Debug log
      const success = await onSave(dataToSend);
      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Error al guardar el producto'
      }));
    } finally {
      setIsSubmitting(false);
    }
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
            <Label htmlFor="description">Descripción</Label>
            <Textarea 
              id="description" 
              placeholder="Describe tu producto, su calidad, proceso de cultivo, etc." 
              defaultValue={producto?.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
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
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting 
              ? "Guardando..." 
              : isEdit 
                ? "Guardar Cambios" 
                : "Publicar Producto"
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
