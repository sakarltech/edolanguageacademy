import { APP_LOGO, APP_TITLE } from "@/const";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Chatbot from "@/components/Chatbot";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Pricing", href: "/pricing" },
    { name: "Schedule", href: "/schedule" },
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
    { name: "Forum", href: "/forum" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <>
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-10" />
                <span className="font-display font-bold text-xl text-foreground hidden sm:block">
                  {APP_TITLE}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    size="sm"
                    className="text-sm"
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
              <Link href="/register">
                <Button size="sm" className="ml-4">
                  Enroll Now
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
              <Link href="/register">
                <Button className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  Enroll Now
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-muted border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-10" />
                <span className="font-display font-bold text-xl text-foreground">
                  {APP_TITLE}
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Reconnect with your heritage. Learn Edo online with live classes, expert instructors, and a supportive community.
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  <strong>Phone:</strong> +44 (0) 7480654969
                </p>
                <p className="text-muted-foreground">
                  <strong>Email:</strong> support@edolanguageacademy.com
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/courses">
                    <span className="text-muted-foreground hover:text-foreground cursor-pointer">
                      Courses
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/pricing">
                    <span className="text-muted-foreground hover:text-foreground cursor-pointer">
                      Pricing
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/schedule">
                    <span className="text-muted-foreground hover:text-foreground cursor-pointer">
                      Schedule
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/about">
                    <span className="text-muted-foreground hover:text-foreground cursor-pointer">
                      About
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/faq">
                    <span className="text-muted-foreground hover:text-foreground cursor-pointer">
                      FAQ
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/contact">
                    <span className="text-muted-foreground hover:text-foreground cursor-pointer">
                      Contact
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/register">
                    <span className="text-muted-foreground hover:text-foreground cursor-pointer">
                      Register
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Edo Language Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    <Chatbot />
    </>
  );
}
