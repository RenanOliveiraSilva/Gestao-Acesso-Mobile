import { ReactNode } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

type ButtonProps = {
  children: ReactNode;
  className?: string; // estilos extras via NativeWind
  onPress?: () => void;
} & TouchableOpacityProps;

export default function ButtonComponent({
  children,
  className = "",
  onPress,
  ...rest
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={`items-center justify-center bg-blue-500 ${className}`}
      onPress={onPress}
      activeOpacity={0.8}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
}
