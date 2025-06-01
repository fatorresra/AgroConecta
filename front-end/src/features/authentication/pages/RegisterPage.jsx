// "use client"

import { useState } from "react"
// import Link from "next/link"
import { Leaf, Upload, MapPin, User, Mail, Lock, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const departamentos = [
  "Amazonas",
  "Antioquia",
  "Arauca",
  "Atlántico",
  "Bolívar",
  "Boyacá",
  "Caldas",
  "Caquetá",
  "Casanare",
  "Cauca",
  "Cesar",
  "Chocó",
  "Córdoba",
  "Cundinamarca",
  "Guainía",
  "Guaviare",
  "Huila",
  "La Guajira",
  "Magdalena",
  "Meta",
  "Nariño",
  "Norte de Santander",
  "Putumayo",
  "Quindío",
  "Risaralda",
  "San Andrés y Providencia",
  "Santander",
  "Sucre",
  "Tolima",
  "Valle del Cauca",
  "Vaupés",
  "Vichada",
]

const tiposProductos = [
  "Frutas",
  "Verduras",
  "Hortalizas",
  "Granos",
  "Café",
  "Cacao",
  "Tubérculos",
  "Cereales",
  "Legumbres",
  "Hierbas aromáticas",
]

export default function RegistroPage() {
  const [tipoUsuario, setTipoUsuario] = useState<string>("")
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    departamento: "",
    municipio: "",
    descripcionPracticas: "",
    productosInteres: [] ,
  })

  const handleProductoInteresChange = (producto, checked) => {
    setFormData((prev) => ({
      ...prev,
      productosInteres: checked
        ? [...prev.productosInteres, producto]
        : prev.productosInteres.filter((p) => p !== producto),
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-800">AgroConecta</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Cuenta</h1>
          <p className="text-gray-600">Únete a nuestra comunidad agrícola</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>Completa todos los campos para crear tu cuenta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tipo de Usuario */}
            <div className="space-y-3">
              <Label className="text-base font-medium">¿Cuál es tu rol?</Label>
              <RadioGroup value={tipoUsuario} onValueChange={setTipoUsuario}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-green-50 transition-colors">
                  <RadioGroupItem value="agricultor" id="agricultor" />
                  <Label htmlFor="agricultor" className="flex-1 cursor-pointer">
                    <div className="font-medium">Soy Agricultor</div>
                    <div className="text-sm text-gray-500">Quiero vender mis productos</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-green-50 transition-colors">
                  <RadioGroupItem value="comprador" id="comprador" />
                  <Label htmlFor="comprador" className="flex-1 cursor-pointer">
                    <div className="font-medium">Soy Comprador</div>
                    <div className="text-sm text-gray-500">Quiero comprar productos agrícolas</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Información Básica */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="nombre"
                    placeholder="Tu nombre completo"
                    className="pl-10"
                    value={formData.nombre}
                    onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="telefono"
                    placeholder="3001234567"
                    className="pl-10"
                    value={formData.telefono}
                    onChange={(e) => setFormData((prev) => ({ ...prev, telefono: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repite tu contraseña"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <Label className="text-base font-medium">Ubicación</Label>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  <Select
                    value={formData.departamento}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, departamento: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {departamentos.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="municipio">Municipio</Label>
                  <Input
                    id="municipio"
                    placeholder="Tu municipio"
                    value={formData.municipio}
                    onChange={(e) => setFormData((prev) => ({ ...prev, municipio: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Campos específicos por rol */}
            {tipoUsuario === "agricultor" && (
              <div className="space-y-4 p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-800">Información de Agricultor</h3>

                <div className="space-y-2">
                  <Label htmlFor="foto">Foto de Perfil</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Haz clic para subir una foto o arrastra aquí</p>
                    <Input type="file" className="hidden" accept="image/*" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcionPracticas">Descripción de tus Prácticas Agrícolas</Label>
                  <Textarea
                    id="descripcionPracticas"
                    placeholder="Describe tus métodos de cultivo, certificaciones, experiencia, etc."
                    rows={4}
                    value={formData.descripcionPracticas}
                    onChange={(e) => setFormData((prev) => ({ ...prev, descripcionPracticas: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {tipoUsuario === "comprador" && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800">Información de Comprador</h3>

                <div className="space-y-3">
                  <Label className="text-base">Tipos de Productos de Interés</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {tiposProductos.map((producto) => (
                      <div key={producto} className="flex items-center space-x-2">
                        <Checkbox
                          id={producto}
                          checked={formData.productosInteres.includes(producto)}
                          onCheckedChange={(checked) => handleProductoInteresChange(producto, checked )}
                        />
                        <Label htmlFor={producto} className="text-sm cursor-pointer">
                          {producto}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Términos y Condiciones */}
            <div className="flex items-center space-x-2">
              <Checkbox id="terminos" />
              <Label htmlFor="terminos" className="text-sm">
                Acepto los{" "}
                <Link href="/terminos" className="text-green-600 hover:underline">
                  términos y condiciones
                </Link>{" "}
                y la{" "}
                <Link href="/privacidad" className="text-green-600 hover:underline">
                  política de privacidad
                </Link>
              </Label>
            </div>

            {/* Botones */}
            <div className="space-y-4">
              <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                Crear Cuenta
              </Button>

              <div className="text-center">
                <span className="text-gray-600">¿Ya tienes cuenta? </span>
                <Link href="/login" className="text-green-600 hover:underline font-medium">
                  Inicia sesión aquí
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
