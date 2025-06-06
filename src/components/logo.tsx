"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 100, height = 100, className = "" }: LogoProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Image
        src="/assets/logo_black.png"
        alt="Logo"
        width={width}
        height={height}
        className={className}
      />
    );
  }

  return (
    <Image
      src={theme === "dark" ? "/assets/logo_white.png" : "/assets/logo_black.png"}
      alt="Logo"
      width={width}
      height={height}
      className={className}
    />
  );
} 