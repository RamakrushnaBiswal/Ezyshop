"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, ShoppingCart, Menu, X } from "lucide-react";
import { ModeToggle } from "../ui/themeButton";
import AuthButtons from "./authButtons";
import { useFlashAlert } from "@/context/flashAlertContext";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface MainNavProps {
  className?: React.HTMLAttributes<HTMLElement>;
  theme: string;
}

export function MainNav({ className, theme }: MainNavProps) {
  const [loading, setLoading] = useState(true);
  const { openDialog } = useFlashAlert();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return null;

  const toggleMenu = () => setIsOpen(!isOpen);

  const routes = [
    { href: `/`, label: "Home", active: pathname === `/` },
    { href: `/shops`, label: "Shops", active: pathname === `/shops` },
    { href: `/About`, label: "About", active: pathname.startsWith(`/About`) },
    {
      href: `/Categories`,
      label: "Categories",
      active: pathname.startsWith(`/Categories`),
    },
    {
      href: `#`,
      label: "Teams",
      active: pathname.startsWith(`/Teams`),
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        openDialog();
      },
    },
    { href: `/Blog`, label: "Blog", active: pathname.startsWith(`/Blog`) },
    {
      href: session.status === "unauthenticated" ? "#" : `/MyOrders`,
      label: "Orders",
      active: pathname.startsWith(`/MyOrders`),
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        if (session.status === "unauthenticated") {
          toast.error("Please login as a Customer first");
        } else {
          router.push("/MyOrders");
        }
      },
    },
    {
      href: session.status === "unauthenticated" ? "#" : `/WishList`,
      label: "Wishlist",
      active: pathname.startsWith(`/WishList`),
      logo: (
        <Heart
          className={`h-5 w-5 ${
            theme === "dark" ? `text-Green` : `text-customTeal`
          }`}
        />
      ),
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        if (session.status === "unauthenticated") {
          toast.error("Please login as a Customer first");
        } else {
          router.push("/WishList");
        }
      },
    },
    {
      href: session.status === "unauthenticated" ? "#" : `/Cart`,
      label: "Cart",
      active: pathname.startsWith(`/Cart`),
      logo: (
        <ShoppingCart
          className={`h-5 w-5 ${
            theme === "dark" ? `text-Green` : `text-customTeal`
          }`}
        />
      ),
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        if (session.status === "unauthenticated") {
          toast.error("Please login as a Customer first");
        } else {
          router.push("/Cart");
        }
      },
    },
    {
      href: `/Contact`,
      label: "Contact",
      active: pathname.startsWith(`/Contact`),
    },
  ];

  return (
    <nav className={cn("sticky top-0 z-50 bg-white dark:bg-black shadow-sm px-4 py-3", className)}>
      {/* Top bar */}
      <div className="flex items-center justify-between">
        {/* Left section - Mobile toggle & Mode */}
        <div className="lg:hidden flex items-center gap-2">
          <ModeToggle />
          <button onClick={toggleMenu} className="focus:outline-none">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-1 font-semibold text-base transition-colors",
                route.active
                  ? `${theme === "dark" ? "text-gray-300" : "text-customTeal"}`
                  : `${theme === "dark" ? "text-gray-400" : "text-customBlue"}`,
                theme === "dark"
                  ? "hover:text-white"
                  : "hover:text-customTeal"
              )}
              onClick={route.onClick}
            >
              {route.logo && <span>{route.logo}</span>}
              {route.label}
            </Link>
          ))}
          <ModeToggle />
          <AuthButtons toggleMenu={toggleMenu} />
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={cn(
          "lg:hidden transition-all duration-300 ease-in-out overflow-hidden",
          isOpen
            ? "max-h-screen opacity-100 py-4 px-6 space-y-4"
            : "max-h-0 opacity-0"
        )}
      >
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "block font-semibold text-base text-center transition-colors",
              route.active
                ? `${theme === "dark" ? "text-gray-300" : "text-customTeal"}`
                : `${theme === "dark" ? "text-gray-400" : "text-customBlue"}`,
              theme === "dark"
                ? "hover:text-white"
                : "hover:text-customTeal"
            )}
            onClick={(e) => {
              toggleMenu();
              if (route.onClick) route.onClick(e);
            }}
          >
            {route.logo && <span className="inline-block mr-1">{route.logo}</span>}
            {route.label}
          </Link>
        ))}
        <AuthButtons toggleMenu={toggleMenu} />
      </div>
    </nav>
  );
}
