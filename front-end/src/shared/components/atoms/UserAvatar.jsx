import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UserAvatar({ 
  user, 
  showOnlineStatus = false, 
  size = "md",
  className = "" 
}) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className={`relative ${className}`}>
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={user?.avatar} alt={user?.nombre || user?.name} />
        <AvatarFallback>
          {getInitials(user?.nombre || user?.name)}
        </AvatarFallback>
      </Avatar>
      {showOnlineStatus && user?.online && (
        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
      )}
    </div>
  );
}
