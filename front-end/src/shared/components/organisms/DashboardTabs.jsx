import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../features/authentication/store/AuthStore';
import { Button } from '@/components/ui/button';
import { Package, MessageCircle, BarChart3 } from 'lucide-react';

export default function DashboardTabs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  
  if (!user) return null;
  
  const baseRoute = user.role === 'agricultor' ? '/farmer' : '/buyer';
  
  const tabs = [
    {
      id: 'products',
      label: user.role === 'agricultor' ? 'Mis Productos' : 'Productos',
      icon: Package,
      path: `${baseRoute}/products`
    },
    {
      id: 'messages',
      label: 'Mensajes',
      icon: MessageCircle,
      path: `/messages`
    },
    {
      id: 'sales',
      label: user.role === 'agricultor' ? 'Ventas' : 'Compras',
      icon: BarChart3,
      path: `${baseRoute}/sales`
    }
  ];

  const handleTabClick = (path) => {
    navigate(path);
  };

  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname === tab.path;
        
        return (
          <Button
            key={tab.id}
            variant={isActive ? "default" : "secondary"}
            className={`flex-1 flex items-center justify-center gap-2 ${
              isActive 
                ? "text-gray-600"  
                : "bg-white shadow-sm text-zinc-800"
            }`}
            onClick={() => handleTabClick(tab.path)}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
}
