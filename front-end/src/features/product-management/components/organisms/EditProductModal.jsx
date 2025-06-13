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

export default function EditProductModal({ producto, open, onOpenChange, onSave }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
          <DialogDescription>Modifica la información de tu producto</DialogDescription>
        </DialogHeader>
        {producto && (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nombre">Nombre del Producto</Label>
                  <Input id="edit-nombre" defaultValue={producto.nombre} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-categoria">Categoría</Label>
                  <Select defaultValue="cafe">
                    <SelectTrigger>
                      <SelectValue />
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

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-precio">Precio por kg</Label>
                  <Input id="edit-precio" type="number" defaultValue={producto.precio} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cantidad">Cantidad Disponible</Label>
                  <Input id="edit-cantidad" type="number" defaultValue="500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-unidad">Unidad</Label>
                  <Select defaultValue="kg">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogramos</SelectItem>
                      <SelectItem value="ton">Toneladas</SelectItem>
                      <SelectItem value="bultos">Bultos</SelectItem>
                      <SelectItem value="cajas">Cajas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-descripcion">Descripción</Label>
                <Textarea
                  id="edit-descripcion"
                  defaultValue="Café orgánico de alta calidad cultivado en las montañas de Huila..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-cosecha">Fecha de Cosecha</Label>
                  <Input id="edit-cosecha" type="date" defaultValue="2024-12-01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-certificacion">Certificación</Label>
                  <Select defaultValue="organico">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="organico">Orgánico</SelectItem>
                      <SelectItem value="fairtrade">Fair Trade</SelectItem>
                      <SelectItem value="convencional">Convencional</SelectItem>
                      <SelectItem value="bpa">Buenas Prácticas Agrícolas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => onSave(producto.id)}>
                Guardar Cambios
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
