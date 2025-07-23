import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import AuthInput from "../atoms/AuthInput"
import SocialLoginButtons from "../molecules/SocialLoginButtons"
import { useAuth } from "../../hooks/useAuth"
import ReCAPTCHA from "react-google-recaptcha";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const recaptchaRef = useRef()

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm()

  // Registro manual
  useState(() => {
    register("recaptcha", { required: "Completa el captcha" })
  }, [register])

  const onSubmit = async (data) => {
    const result = await login(data);
    if (!result.success) {
      if (result.error === 'User does not exist with this email.') {
        setError('email', {
          type: 'manual',
          message: 'No existe un usuario con este correo electrónico',
        }, { shouldFocus: true });
      } else if (result.error === 'Invalid password.') {
        setError('password', {
          type: 'manual',
          message: 'Contraseña incorrecta',
        }, { shouldFocus: true });
      } else if (
        result.error?.toLowerCase().includes('captcha') ||
        result.error?.toLowerCase().includes('recaptcha')
      ) {
        setError('recaptcha', {
          type: 'manual',
          message: result.error,
        });
        if (recaptchaRef.current) recaptchaRef.current.reset();
      } else {
        setError('api', {
          type: 'manual',
          message: result.error || 'Error al iniciar sesión',
        });
        if (recaptchaRef.current) recaptchaRef.current.reset();
      }
    }
  }


  const passwordToggleIcon = showPassword ? (
    <button
      type="button"
      onClick={() => setShowPassword(false)}
      className="hover:text-gray-600"
    >
      <EyeOff className="h-4 w-4" />
    </button>
  ) : (
    <button
      type="button"
      onClick={() => setShowPassword(true)}
      className="hover:text-gray-600"
    >
      <Eye className="h-4 w-4" />
    </button>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      <AuthInput
        {...register("email", {
          required: "El correo electrónico es obligatorio",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "El correo electrónico no es válido",
          },
        })}
        id="email"
        type="email"
        label="Correo Electrónico"
        placeholder="tu@email.com"
        icon={Mail}
        error={errors.email?.message}
      />

      <AuthInput
        {...register("password", {
          required: "La contraseña es obligatoria",
        })}
        id="password"
        type={showPassword ? "text" : "password"}
        label="Contraseña"
        placeholder="Tu contraseña"
        icon={Lock}
        rightIcon={passwordToggleIcon}
        error={errors.password?.message}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            {...register("rememberMe")}
          />
          <Label htmlFor="remember" className="text-sm cursor-pointer">
            Recordarme
          </Label>
        </div>
        <Link to="/recuperar-password" className="text-sm text-green-600 hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <div className="flex justify-center flex-col items-center">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
          onChange={token => setValue("recaptcha", token, { shouldValidate: true })}
        />
        {errors.recaptcha && (
          <p className="mt-2 text-sm text-red-500">
            {errors.recaptcha.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
      </Button>

      <SocialLoginButtons />

      <div className="text-center">
        <span className="text-gray-600">¿No tienes cuenta? </span>
        <Link to="/register" className="text-green-600 hover:underline font-medium">
          Regístrate aquí
        </Link>
      </div>
    </form>
  )
}
