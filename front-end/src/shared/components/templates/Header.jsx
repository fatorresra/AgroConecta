import { Link } from "react-router-dom"
import { Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/shared/components/atoms/ThemeToggle"

export default function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Leaf className="h-8 w-8 text-green-600" />
          <span className="text-2xl font-bold text-green-800">AgroConecta</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          {/* <Link
            to="/products"
            className="text-gray-600 hover:text-green-600 transition-colors"
          >
            Productos
          </Link>
          <Link
            to="/agricultores"
            className="text-gray-600 hover:text-green-600 transition-colors"
          >
            Agricultores
          </Link>
          <Link
            to="/como-funciona"
            className="text-gray-600 hover:text-green-600 transition-colors"
          >
            Cómo Funciona
          </Link> */}
        </nav>
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <Button variant="outline" asChild>
            <Link to="/login">Iniciar Sesión</Link>
          </Button>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link to="/register">Registrarse</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
