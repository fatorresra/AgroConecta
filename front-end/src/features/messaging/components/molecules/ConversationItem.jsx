import { Badge } from "@/components/ui/badge"
import UserAvatar from "@/shared/components/atoms/UserAvatar"

export function ConversationItem({ 
  conversation, 
  isSelected = false, 
  onClick,
  showProduct = true 
}) {
  const handleClick = () => {
    if (onClick) {
      onClick(conversation);
    }
  };

  return (
    <div
      className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition-colors ${
        isSelected ? "bg-blue-50 border-blue-200" : "bg-white"
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        <UserAvatar 
          user={conversation.usuario} 
          showOnlineStatus={true} 
          size="md" 
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {conversation.usuario.nombre}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                {conversation.ultimoMensaje.fecha}
              </span>
              {conversation.noLeidos > 0 && (
                <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {conversation.noLeidos}
                </Badge>
              )}
            </div>
          </div>

          {showProduct && conversation.producto && (
            <div className="flex items-center space-x-2 mb-2">
              {/* <img
                src={conversation.producto.imagen}
                alt={conversation.producto.nombre}
                className="h-6 w-6 rounded object-cover"
              /> */}
              <span className="text-xs text-gray-600 truncate">
                {conversation.producto.nombre}
              </span>
            </div>
          )}

          <p className={`text-sm truncate ${
            conversation.ultimoMensaje.leido || conversation.ultimoMensaje.enviado
              ? "text-gray-600"
              : "text-gray-900 font-medium"
          }`}>
            {conversation.ultimoMensaje.enviado && "Tú: "}
            {conversation.ultimoMensaje.texto}
          </p>
        </div>
      </div>
    </div>
  );
}
