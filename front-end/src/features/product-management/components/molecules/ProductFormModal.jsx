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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from "lucide-react"

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
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Producto</Label>
              <Input 
                id="nombre" 
                placeholder="Ej: Café Orgánico Premium" 
                defaultValue={producto?.nombre}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Select defaultValue={producto?.categoria || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frutas">Frutas</SelectItem>
                  <SelectItem value="verduras">Verduras</SelectItem>
                  <SelectItem value="cafe">Café</SelectItem>
                  <SelectItem value="cacao">Cacao</SelectItem>
                  <SelectItem value="tuberculos">Tubérculos</SelectItem>
                  <SelectItem value="granos">Granos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="precio">Precio (COP)</Label>
              <Input 
                id="precio" 
                type="number" 
                placeholder="Ej: 25000" 
                defaultValue={producto?.precio}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unidad">Unidad de Medida</Label>
              <Select defaultValue={producto?.unidad || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona unidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilogramos</SelectItem>
                  <SelectItem value="g">Gramos</SelectItem>
                  <SelectItem value="lb">Libras</SelectItem>
                  <SelectItem value="unidad">Unidad</SelectItem>
                  <SelectItem value="docena">Docena</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea 
              id="descripcion" 
              placeholder="Describe tu producto, su calidad, proceso de cultivo, etc." 
              defaultValue={producto?.descripcion}
            />
          </div>

          {!isEdit && (
            <div className="space-y-2">
              <Label>Imágenes del Producto</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Arrastra imágenes aquí o haz clic para seleccionar</p>
                <p className="text-xs text-gray-500 mt-1">Máximo 5 imágenes, formato JPG o PNG</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700" 
            onClick={() => onSave(producto?.id)}
          >
            {isEdit ? "Guardar Cambios" : "Publicar Producto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
