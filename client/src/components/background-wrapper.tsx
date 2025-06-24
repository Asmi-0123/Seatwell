import { ReactNode } from "react";
import { theme } from "@/config/content";

interface BackgroundWrapperProps {
  children: ReactNode;
  className?: string;
  useHomepageBackground?: boolean;
}

export function BackgroundWrapper({ children, className = "", useHomepageBackground = false }: BackgroundWrapperProps) {
  const getBackgroundStyle = () => {
    const bgConfig = useHomepageBackground ? theme.background.homepage : theme.background.global;
    
    switch (bgConfig.type) {
      case "image":
        return {
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bgConfig.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        };
      case "solid":
        return { backgroundColor: bgConfig.solid };
      default:
        return { background: bgConfig.gradient };
    }
  };

  return (
    <div 
      className={`min-h-screen ${className}`}
      style={getBackgroundStyle()}
    >
      {children}
    </div>
  );
}