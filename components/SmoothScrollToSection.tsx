"use client";
import React, { useEffect } from "react";

export default function SmoothScrollToSection({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  useEffect(() => {
    const handleSmoothScroll = (e: MouseEvent): void => {
      e.preventDefault();
      const href = (e.currentTarget as HTMLAnchorElement).getAttribute("href");
      if (href) {
        const targetId = href.replace(/.*\#/, "");
        const elem = document.getElementById(targetId);
        elem?.scrollIntoView({
          behavior: "smooth",
        });
      }
    };

    const button = document.querySelector(`a[href="${href}"]`);
    button?.addEventListener("click", handleSmoothScroll as EventListener);

    return () => {
      button?.removeEventListener("click", handleSmoothScroll as EventListener);
    };
  }, [href]);

  return <>{children}</>;
}
