import { Wifi, WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useMessageStore } from "../../store/messageStore"

export default function ConnectionStatus() {
  const { isConnected } = useMessageStore();

  return (
    <div className="flex items-center gap-2 p-2 bg-white border-b">
      <div className="flex items-center gap-1">
        {isConnected ? (
          <>
            <Wifi className="h-4 w-4 text-green-500" />
            <Badge variant="outline" className="text-green-600 border-green-200">
              En línea
            </Badge>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-red-500" />
            <Badge variant="outline" className="text-red-600 border-red-200">
              Desconectado
            </Badge>
          </>
        )}
      </div>
      <span className="text-xs text-gray-500">
        {isConnected ? 'Mensajes en tiempo real' : 'Reconectando...'}
      </span>
    </div>
  );
} 