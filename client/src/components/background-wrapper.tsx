import { ReactNode } from "react";
import { theme } from "@/config/content";

interface BackgroundWrapperProps {
  children: ReactNode;
  className?: string;
}

export function BackgroundWrapper({ children, className = "" }: BackgroundWrapperProps) {
  const getBackgroundStyle = () => {
    switch (theme.background.type) {
      case "image":
        return {
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${theme.background.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        };
      case "solid":
        return { backgroundColor: theme.background.solid };
      default:
        return { background: theme.background.gradient };
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