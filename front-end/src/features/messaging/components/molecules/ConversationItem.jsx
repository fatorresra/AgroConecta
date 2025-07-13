import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export function ConversationItem({ conversation, isSelected, onClick }) {
  const formatPrice = (price) => {
    if (!price) return '';
    return `$${price.toLocaleString()}`;
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 hover:bg-gray-100 cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar>
          <AvatarImage src={conversation.usuario.avatar} alt={conversation.usuario.nombre} />
          <AvatarFallback>{conversation.usuario.nombre.charAt(0)}</AvatarFallback>
        </Avatar>
        {conversation.usuario.online && (
          <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-gray-900 truncate">
            {conversation.usuario.nombre}
          </p>
          <div className="flex items-center gap-1">
            {conversation.noLeidos > 0 && (
              <Badge variant="destructive" className="text-xs">
                {conversation.noLeidos}
              </Badge>
            )}
            <span className="text-xs text-gray-500">
              {conversation.ultimoMensaje.fecha}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden flex-shrink-0">
            <img 
              src={conversation.producto.imagen} 
              alt={conversation.producto.nombre}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-600 truncate">
              {conversation.producto.nombre}
            </p>
            {conversation.producto.precio && (
              <p className="text-xs font-medium text-green-600">
                {formatPrice(conversation.producto.precio)}
                {conversation.producto.unidad && ` / ${conversation.producto.unidad}`}
              </p>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500 truncate">
          {conversation.ultimoMensaje.texto}
        </p>
      </div>
    </div>
  );
}
