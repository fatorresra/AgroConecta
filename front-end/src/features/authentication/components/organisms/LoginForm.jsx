import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import AuthInput from "../atoms/AuthInput"
import SocialLoginButtons from "../molecules/SocialLoginButtons"
import { loginUser } from "../../services/AuthService"
import { useAuthStore } from "../../store/AuthStore" // <-- Importa tu store

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const login = useAuthStore((state) => state.login) // <-- Obtén la función login del store

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await loginUser(formData)
      if (result.success) {
        // Actualiza el store con el token y los datos del usuario
        login(result.user.token, result.user)
        alert("¡Login exitoso!")
        // Aquí puedes agregar la redirección
      } else {
        alert(result.message)
      }
    } catch (error) {
      alert("Error al iniciar sesión")
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <AuthInput
        id="email"
        type="email"
        label="Correo Electrónico"
        placeholder="tu@email.com"
        icon={Mail}
        value={formData.email}
        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
      />

      <AuthInput
        id="password"
        type={showPassword ? "text" : "password"}
        label="Contraseña"
        placeholder="Tu contraseña"
        icon={Lock}
        rightIcon={passwordToggleIcon}
        value={formData.password}
        onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={formData.rememberMe}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, rememberMe: checked }))}
          />
          <Label htmlFor="remember" className="text-sm cursor-pointer">
            Recordarme
          </Label>
        </div>
        <Link to="/recuperar-password" className="text-sm text-green-600 hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg">
        Iniciar Sesión
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
