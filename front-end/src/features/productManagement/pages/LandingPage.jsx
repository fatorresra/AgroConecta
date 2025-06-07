// import Image from "next/image"
import { Link } from "react-router-dom"
import { Leaf, Users, MapPin, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/shared/components/templates/Header"
import Footer from "@/shared/components/templates/Footer"
import HeroSection from "../components/organisms/HeroSection"
import FeaturesSection from "../components/organisms/FeaturesSection"
import ProductGrid from "../components/organisms/ProductGrid"

const featuredProducts = [
  {
    id: 1,
    name: "Café Orgánico Premium",
    farmer: "María González",
    location: "Huila, Colombia",
    price: 15000,
    unit: "kg",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.8,
    harvest: "Diciembre 2024",
  },
  {
    id: 2,
    name: "Aguacate Hass",
    farmer: "Carlos Rodríguez",
    location: "Antioquia, Colombia",
    price: 3500,
    unit: "kg",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.9,
    harvest: "Enero 2025",
  },
  {
    id: 3,
    name: "Plátano Hartón",
    farmer: "Ana Martínez",
    location: "Quindío, Colombia",
    price: 2200,
    unit: "kg",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.7,
    harvest: "Todo el año",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />

      <main>
        <HeroSection />

        <FeaturesSection />

        {/* Featured Products */}
        <section className="py-20 px-4 bg-green-50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
              <p className="text-xl text-gray-600">Descubre los mejores productos de nuestros agricultores</p>
            </div>

            <ProductGrid products={featuredProducts} />

            <div className="text-center mt-12">
              <Button variant="outline" size="lg" asChild>
                <Link to="/products">Buscar mas productos</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-green-600 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para comenzar?</h2>
            <p className="text-xl mb-8 opacity-90">
              Únete a nuestra comunidad de agricultores y compradores comprometidos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/register">Soy Agricultor</Link>
              </Button>
              <Button
                size="lg" variant="ghost" asChild
              >
                <Link to="/register">Soy Comprador</Link>
              </Button>
              
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
