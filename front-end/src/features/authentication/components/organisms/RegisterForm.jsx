import { useState } from "react"
import { Link } from "react-router-dom"
import { User, Mail, Lock, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import AuthInput from "../atoms/AuthInput"
import RoleSelector from "../molecules/RoleSelector"
import LocationFields from "../molecules/LocationFields"
import FarmerProfileFields from "../molecules/FarmerProfileFields"
import ProductInterestSelector from "../molecules/ProductInterestSelector"

export default function RegisterForm() {
  const [tipoUsuario, setTipoUsuario] = useState("")
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    departamento: "",
    municipio: "",
    descripcionPracticas: "",
    productosInteres: [],
  })

  const handleProductoInteresChange = (producto, checked) => {
    setFormData((prev) => ({
      ...prev,
      productosInteres: checked
        ? [...prev.productosInteres, producto]
        : prev.productosInteres.filter((p) => p !== producto),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implement registration logic
    console.log("Form submitted:", { tipoUsuario, ...formData })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <RoleSelector value={tipoUsuario} onChange={setTipoUsuario} />

      <div className="grid md:grid-cols-2 gap-4">
        <AuthInput
          id="nombre"
          label="Nombre Completo"
          placeholder="Tu nombre completo"
          icon={User}
          value={formData.nombre}
          onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
        />
        <AuthInput
          id="telefono"
          label="Teléfono"
          placeholder="3001234567"
          icon={Phone}
          value={formData.telefono}
          onChange={(e) => setFormData((prev) => ({ ...prev, telefono: e.target.value }))}
        />
      </div>

      <AuthInput
        id="email"
        type="email"
        label="Correo Electrónico"
        placeholder="tu@email.com"
        icon={Mail}
        value={formData.email}
        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
      />

      <div className="grid md:grid-cols-2 gap-4">
        <AuthInput
          id="password"
          type="password"
          label="Contraseña"
          placeholder="Mínimo 8 caracteres"
          icon={Lock}
          value={formData.password}
          onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
        />
        <AuthInput
          id="confirmPassword"
          type="password"
          label="Confirmar Contraseña"
          placeholder="Repite tu contraseña"
          icon={Lock}
          value={formData.confirmPassword}
          onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
        />
      </div>

      <LocationFields
        departamento={formData.departamento}
        municipio={formData.municipio}
        onDepartamentoChange={(value) => setFormData((prev) => ({ ...prev, departamento: value }))}
        onMunicipioChange={(value) => setFormData((prev) => ({ ...prev, municipio: value }))}
      />

      {tipoUsuario === "agricultor" && (
        <FarmerProfileFields
          descripcionPracticas={formData.descripcionPracticas}
          onDescripcionChange={(value) => 
            setFormData((prev) => ({ ...prev, descripcionPracticas: value }))
          }
        />
      )}

      {tipoUsuario === "comprador" && (
        <ProductInterestSelector
          selectedProducts={formData.productosInteres}
          onProductChange={handleProductoInteresChange}
        />
      )}

      <div className="flex items-center space-x-2">
        <Checkbox id="terminos" />
        <Label htmlFor="terminos" className="text-sm">
          Acepto los{" "}
          <Link to="/terminos" className="text-green-600 hover:underline">
            términos y condiciones
          </Link>{" "}
          y la{" "}
          <Link to="/privacidad" className="text-green-600 hover:underline">
            política de privacidad
          </Link>
        </Label>
      </div>

      <div className="space-y-4">
        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg">
          Crear Cuenta
        </Button>

        <div className="text-center">
          <span className="text-gray-600">¿Ya tienes cuenta? </span>
          <Link to="/login" className="text-green-600 hover:underline font-medium">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </form>
  )
}
