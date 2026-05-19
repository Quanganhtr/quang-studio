"use client";

export default function HeroWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-app flex flex-col overflow-hidden">
      {children}
    </div>
  );
}
