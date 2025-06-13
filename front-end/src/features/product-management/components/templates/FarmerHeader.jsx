import Link from "next/link"
import { Leaf, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function FarmerHeader({ nombreAgricultor }) {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-800">AgroConecta</span>
          </Link>
          <span className="text-gray-400">|</span>
          <span className="text-lg font-medium text-gray-700">Panel de Agricultor</span>
          <span className="text-gray-400">|</span>
          <div>
            <h1 className="text-lg font-bold text-gray-900">¡Bienvenido, {nombreAgricultor}!</h1>
            <p className="text-sm text-gray-600">Gestiona tus productos y conecta con compradores</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/mensajes">
              <MessageSquare className="h-4 w-4 mr-2" />
              Mensajes (3)
            </Link>
          </Button>
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback>{nombreAgricultor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
