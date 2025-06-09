import { useState } from "react"
import { useForm } from "react-hook-form"
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
  // TO DO: Update fields based on contract
  const [tipoUsuario, setTipoUsuario] = useState("")
  const { 
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm()

  const onSubmit = data => {
    // TO DO: Send registration data to backend
    console.log("Form submitted:", data)
  }

  const handleProductosInteresChange = (producto, checked) => {
    const current = watch("productosInteres") || [];
    const updated = checked
      ? [...current, producto]
      : current.filter((p) => p !== producto);
    setValue("productosInteres", updated);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <RoleSelector value={tipoUsuario} onChange={setTipoUsuario} />

      <div className="grid md:grid-cols-2 gap-4">
        <AuthInput
          {...register("nombre", {
            required: "Este campo es obligatorio",
          })}
          id="nombre"
          label="Nombre Completo"
          placeholder="Tu nombre completo"
          icon={User}
          error={errors.nombre?.message}
        />
        <AuthInput
          {...register("telefono")}
          id="telefono"
          label="Teléfono"
          placeholder="3001234567"
          icon={Phone}
        />
      </div>

      <AuthInput
        {...register("email", {
          required: "Este campo es obligatorio",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "El correo electrónico no es válido",
          },
        })}
        id="email"
        label="Correo Electrónico"
        placeholder="tu@email.com"
        icon={Mail}
        error={errors.email?.message}
      />

      <div className="grid md:grid-cols-2 gap-4">
        <AuthInput
          {...register("password", {
            required: "Este campo es obligatorio",
            minLength: {
              value: 8,
              message: "La contraseña debe tener al menos 8 caracteres",
            },
          })}
          id="password"
          type="password"
          label="Contraseña"
          placeholder="Mínimo 8 caracteres"
          icon={Lock}
          error={errors.password?.message}
        />
        <AuthInput
          {...register("confirmPassword", {
            required: "Este campo es obligatorio",
            validate: (value) => 
              value === watch("password") || "Las contraseñas no coinciden",
          })}
          id="confirmPassword"
          type="password"
          label="Confirmar Contraseña"
          placeholder="Repite tu contraseña"
          icon={Lock}
          error={errors.confirmPassword?.message}
        />
      </div>

      <LocationFields
        departamento={watch("departamento") || ""}
        municipio={watch("municipio") || ""}
        onDepartamentoChange={(value) => setValue("departamento", value)}
        onMunicipioChange={(value) => setValue("municipio", value)}
      />

      {tipoUsuario === "agricultor" && (
        <FarmerProfileFields
          descripcionPracticas={watch("descripcionPracticas") || ""}
          onDescripcionChange={(value) => setValue("descripcionPracticas", value)}
        />
      )}

      {tipoUsuario === "comprador" && (
        <ProductInterestSelector
          selectedProducts={watch("productosInteres") || []}
          onProductChange={handleProductosInteresChange}
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
