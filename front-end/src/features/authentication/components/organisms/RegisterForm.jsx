import { useAuth } from '../../hooks/useAuth'
import { useEffect } from "react"
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
import ReCAPTCHA from "react-google-recaptcha";

export default function RegisterForm() {
  const { register: registerHook } = useAuth()
  const { 
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm()

  const role = watch("role") || ""

  // Manual field registrations
  useEffect(() => {
    register("role", { required: "Selecciona un rol" })
    register("recaptcha", { required: "Completa el captcha" })
  }, [register])

  const onSubmit = async (data) => {
    // Remove password_confirm from form data
    const { password_confirm: _password_confirm, ...formData } = data;
    
    const result = await registerHook(formData);
    if (!result.success) {
      // Specific email error handling
      if (result.error === 'User already exists with this email.') {
        setError('email', {
          type: 'manual',
          message: 'Este correo electrónico ya está en uso',
        }, { shouldFocus: true });
      } else {
        setError('api', {
          type: 'manual',
          message: result.error,
        });
      }
    }
  }

  const updatePreferredProducts = (producto, checked) => {
    const current = watch("preferred_products") || [];
    const updated = checked
      ? [...current, producto]
      : current.filter((p) => p !== producto)
    setValue("preferred_products", updated)
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <RoleSelector
        value={role}
        onChange={value => setValue("role", value, { shouldValidate: true })}
        error={errors.role?.message}
      />

      <div className="grid md:grid-cols-2 gap-4">
        <AuthInput
          {...register("name", {
            required: "Este campo es obligatorio",
          })}
          id="nombre"
          label="Nombre Completo"
          placeholder="Tu nombre completo"
          icon={User}
          error={errors.name?.message}
        />
        <AuthInput
          {...register("phone")}
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
          {...register("password_confirm", {
            required: "Este campo es obligatorio",
            validate: (value) => 
              value === watch("password") || "Las contraseñas no coinciden",
          })}
          id="password_confirm"
          type="password"
          label="Confirmar Contraseña"
          placeholder="Repite tu contraseña"
          icon={Lock}
          error={errors.password_confirm?.message}
        />
      </div>

      <LocationFields
        departamento={watch("department") || ""}
        municipio={watch("municipality") || ""}
        onDepartamentoChange={(value) => setValue("department", value)}
        onMunicipioChange={(value) => setValue("municipality", value)}
      />

      {role === "agricultor" && (
        <FarmerProfileFields
          descripcionPracticas={watch("description") || ""}
          onDescripcionChange={(value) => setValue("description", value)}
        />
      )}

      {role === "comprador" && (
        <ProductInterestSelector
          selectedProducts={watch("preferred_products") || []}
          onProductChange={updatePreferredProducts}
        />
      )}

      {errors.api && (
        <p className="mt-2 text-sm text-red-500">
          {errors.api.message}
        </p>
      )}

      <div className="flex justify-center">
        <ReCAPTCHA
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
          onChange={token => setValue("recaptcha", token, { shouldValidate: true })}
        />
        {errors.recaptcha && (
          <p className="mt-2 text-sm text-red-500">
            {errors.recaptcha.message}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg"
          disabled={isSubmitting}>
          {isSubmitting ? "Cargando..." : "Crear Cuenta"}
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
