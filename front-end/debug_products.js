import axios from 'axios';
import { PORTS } from './src/shared/utils/Ports.js';

const PRODUCTS_API_URL = `${PORTS.PRODUCTS.BASE_URL}/products`;

// Función para transformar producto del backend al formato frontend
const transformProductFromAPI = (product) => {
  if (!product) return null;

  return {
    id: product.product_id,
    nombre: product.name,
    name: product.name,
    agricultor: `Agricultor ${product.farm_id}`,
    farmer: `Agricultor ${product.farm_id}`,
    farmer_id: product.farm_id,
    agricultor_id: product.farm_id,
    ubicacion: 'Colombia',
    location: 'Colombia',
    precio: product.price_per_unit,
    price: product.price_per_unit,
    unidad: 'kg',
    unit: 'kg',
    imagen: '/placeholder.svg?height=200&width=300',
    image: '/placeholder.svg?height=200&width=300',
    rating: 4.5 + Math.random() * 0.5,
    cosecha: product.harvest_date ? new Date(product.harvest_date).toLocaleDateString() : 'Disponible',
    harvest: product.harvest_date ? new Date(product.harvest_date).toLocaleDateString() : 'Disponible',
    categoria: product.type,
    category: product.type,
    certificacion: 'Convencional',
    certification: 'Convencional',
    disponible: product.quantity,
    available: product.quantity,
    descripcion: product.description,
    description: product.description,
    fechaCreacion: product.created_at,
    createdAt: product.created_at
  };
};

// Función de prueba
async function testProductService() {
  try {
    console.log('🔍 Probando conexión al backend...');
    console.log('URL del backend:', PRODUCTS_API_URL);
    
    const response = await axios.get(PRODUCTS_API_URL);
    console.log('✅ Respuesta del backend recibida');
    console.log('📊 Datos del backend:', JSON.stringify(response.data, null, 2));
    
    const transformedProducts = response.data.map(transformProductFromAPI);
    console.log('🔄 Productos transformados:', JSON.stringify(transformedProducts, null, 2));
    
    console.log(`📈 Total de productos: ${transformedProducts.length}`);
    
    // Verificar cada producto
    transformedProducts.forEach((product, index) => {
      console.log(`\n📦 Producto ${index + 1}:`);
      console.log(`  - ID: ${product.id}`);
      console.log(`  - Nombre: ${product.nombre}`);
      console.log(`  - Precio: $${product.precio}`);
      console.log(`  - Categoría: ${product.categoria}`);
      console.log(`  - Disponible: ${product.disponible}`);
      console.log(`  - Agricultor: ${product.agricultor}`);
    });
    
  } catch (error) {
    console.error('❌ Error al probar el servicio:', error);
    if (error.response) {
      console.error('📋 Detalles del error:', error.response.data);
      console.error('🔢 Status code:', error.response.status);
    }
  }
}

// Ejecutar la prueba
testProductService(); 