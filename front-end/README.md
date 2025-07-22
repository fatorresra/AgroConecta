# Instrucciones para Ejecutar el Sistema Agroconecta

## 🚀 Servicios Requeridos

Para que el sistema funcione completamente, necesitas ejecutar estos 3 servicios:

### 1. **ProductService** (Puerto 5000)
```bash
cd ProductService
python main.py
```
- **URL**: http://localhost:5000
- **Endpoints**: `/products`, `/products/{id}`, etc.
- **Documentación**: Revisar carpeta `app/docs/swagger/`

### 2. **OnlineChatService** (Puerto 8000)
```bash
cd OnlineChatService
python main.py
```
- **URL**: http://localhost:8000
- **WebSocket**: ws://localhost:8000/socket.io/
- **Documentación**: http://localhost:8000/docs

### 3. **Frontend** (Puerto 5173)
```bash
cd Agroconecta-Front-end/front-end
npm install
npm run dev
```
- **URL**: http://localhost:5173
- **Aplicación Web**: Interfaz de usuario completa

## 📋 Orden de Ejecución

1. **Primero**: Ejecutar ProductService
2. **Segundo**: Ejecutar OnlineChatService
3. **Tercero**: Ejecutar Frontend

## 🔧 Configuración de Puertos

Los puertos están configurados en `src/shared/utils/Ports.js`:

```javascript
export const PORTS = {
  AUTH: {
    BASE_URL: "http://127.0.0.1:5001" // Servicio de autenticación
  },
  PRODUCTS: {
    BASE_URL: "http://localhost:5000" // ProductService
  },
  CHAT: {
    BASE_URL: "http://localhost:8000", // OnlineChatService
    WS_URL: "ws://localhost:8000/socket.io/" // WebSocket
  }
};
```

## 🌟 Funcionalidades Integradas

### **Productos**
- ✅ Obtener todos los productos desde ProductService
- ✅ Filtrar y buscar productos
- ✅ Ver detalles de producto específico
- ✅ Manejo de estados de carga y errores

### **Chat**
- ✅ Crear chat desde cualquier producto
- ✅ Comunicación en tiempo real via WebSocket
- ✅ Lista de conversaciones organizadas por producto
- ✅ Información del producto en cada chat

### **Rutas Principales**
- `/` - Página de inicio
- `/products` - Catálogo de productos (conectado a ProductService)
- `/products/:id` - Detalles del producto
- `/messages` - Sistema de chat unificado
- `/login` - Autenticación
- `/register` - Registro de usuarios

## 🛠️ Dependencias Adicionales

Si tienes problemas con alguna dependencia:

```bash
# En el frontend
npm install socket.io-client axios zustand
```

## 📝 Notas Importantes

1. **Autenticación**: El sistema usa JWT tokens para autenticación
2. **WebSocket**: Los mensajes se envían en tiempo real
3. **Transformación de datos**: Los datos del backend se transforman al formato esperado por el frontend
4. **Manejo de errores**: Cada servicio tiene su propio manejo de errores

## 🔍 Verificar que Todo Funciona

1. **Productos**: Ve a http://localhost:5173/products y verifica que cargan productos reales
2. **Chat**: Haz clic en "Chat" en cualquier producto y verifica que se crea la conversación
3. **Tiempo real**: Abre dos pestañas y envía mensajes para probar WebSocket

## 🐛 Resolución de Problemas

- **Error de conexión**: Verifica que todos los servicios estén ejecutándose
- **CORS**: Los servicios backend deben tener CORS habilitado
- **Puertos**: Asegúrate de que los puertos no estén siendo usados por otras aplicaciones

## 📚 Documentación API

- **ProductService**: Revisar archivos `.yml` en `/app/docs/swagger/`
- **OnlineChatService**: http://localhost:8000/docs (cuando esté ejecutándose) 