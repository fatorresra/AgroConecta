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

export default function NewProductModal({ open, onOpenChange, onSave }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Publicar Nuevo Producto</DialogTitle>
          <DialogDescription>
            Completa la información de tu producto para publicarlo en la plataforma
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Producto</Label>
              <Input id="nombre" placeholder="Ej: Café Orgánico Premium" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Select>
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

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="precio">Precio por kg</Label>
              <Input id="precio" type="number" placeholder="15000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad Disponible</Label>
              <Input id="cantidad" type="number" placeholder="500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unidad">Unidad</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="kg" />
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
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe tu producto, métodos de cultivo, certificaciones..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cosecha">Fecha de Cosecha</Label>
              <Input id="cosecha" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certificacion">Certificación</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona certificación" />
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

          <div className="space-y-2">
            <Label>Imágenes del Producto</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Arrastra imágenes aquí o haz clic para seleccionar</p>
              <p className="text-xs text-gray-500 mt-1">Máximo 5 imágenes, formato JPG o PNG</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="insumos">Insumos Utilizados</Label>
            <Textarea
              id="insumos"
              placeholder="Lista los fertilizantes, pesticidas u otros insumos utilizados..."
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={onSave}>
            Publicar Producto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
