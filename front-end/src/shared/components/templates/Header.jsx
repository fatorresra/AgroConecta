import { Link } from "react-router-dom"
import { Leaf, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import UserAvatar from "@/shared/components/atoms/UserAvatar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { useAuthStore } from "@/features/authentication/store/AuthStore";
import ThemeToggle from "@/shared/components/atoms/ThemeToggle"

export default function Header({ 
  pageTitle = "", 
  pageDescription = "",
  showAuthButtons = true,
  notificationCount = 0
}) {
  const { user, token, logout } = useAuthStore();
  const isAuthenticated = Boolean(token);
  const userName = user?.name || "";
  const userType = user?.role || "";

  const renderAuthSection = () => {
    if (showAuthButtons && !isAuthenticated) {  
      return (
        <>
          <Button variant="outline" asChild>
            <Link to="/login">Iniciar Sesión</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Registrarse</Link>
          </Button>
        </>
      )
    } else if (isAuthenticated) {
      return (
        <div className="flex items-center space-x-4">

          {/* Messages icon, notificationCount not updated */}
          <Button variant="outline" size="sm" asChild>
            <Link to="/messages" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Mensajes{notificationCount > 0 ? ` (${notificationCount})` : ''}
            </Link>
          </Button>

          {/* User actions menu */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="cursor-pointer">
                <UserAvatar user={user} className="cursor-pointer" />
              </div>
            </PopoverTrigger>
            <PopoverContent align="end" className="min-w-max">
              <div className="flex flex-col items-stretch gap-1">
                {userType === "agricultor" && (
                  <>
                    <Link to="/farmer/products" className="px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition">
                      Mis Productos
                    </Link>
                    <hr className="my-1 w-full border-gray-200" />
                  </>
                )}
                <Link
                  to="/"
                  className="px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                  onClick={logout}
                >
                  Cerrar Sesión
                </Link>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )
    }
    return null
  }

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">AgroConecta</span>
          </Link>
          {pageTitle && (
            <>
              <span className="text-gray-400">|</span>
              <span className="text-lg font-medium text-gray-700">{pageTitle}</span>
              <span className="text-gray-400">|</span>
              <div>
                {userName && (
                  <h1 className="text-lg font-bold text-gray-900">¡Bienvenido, {userName}!</h1>
                )}
                {pageDescription && (
                  <p className="text-sm text-gray-600">{pageDescription}</p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* <ThemeToggle /> */}
          {renderAuthSection()}
        </div>
      </div>
    </header>
  )
}
