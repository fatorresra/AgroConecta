import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (    <section className="relative">
      {/* Hero Content */}
      <div className="container mx-auto text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Conectando el <span className="text-green-600">Campo Colombiano</span>{" "}
            con el Mundo
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Plataforma que facilita la negociación directa entre agricultores y
            compradores, eliminando intermediarios y garantizando precios justos
            para productos frescos y de calidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12"></div>
            <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
              <Link to="/register">
                Comenzar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/products">Explorar Productos</Link>
            </Button>
          </div>
          {/* Imagen agregada */}
          {/* <div className="mt-12 max-w-3xl mx-auto">
            <img
              src="Agro.jpg" // Reemplaza con la ruta de tu imagen
              alt="Campo Colombiano"
              className="w-full h-auto rounded-lg shadow-xl"
            />          </div> */}
        </div>
      </div>

      {/* Full-width Image Section */}
      <div className="w-full relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent h-32 z-10"/>
        <img
          src="/Agro.jpg"
          alt="Campo Colombiano"
          className="w-full h-[500px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent h-32 bottom-0"/>
      </div>
    </section>
  )
}
