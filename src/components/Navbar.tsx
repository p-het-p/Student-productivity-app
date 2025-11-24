import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface NavbarProps {
  onOpenAccount?: () => void;
}

export function Navbar({ onOpenAccount }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Homework", href: "#homework" },
    { name: "Timetable", href: "#timetable" },
    { name: "Syllabus", href: "#syllabus" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="font-['Poppins:Bold',sans-serif] text-[#e43d11] text-2xl">
              H-WORK
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-['Poppins:Regular',sans-serif] text-[#e43d11] hover:text-[#c73410] transition-colors duration-200 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#e43d11] transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
            <Button
              onClick={onOpenAccount}
              variant="outline"
              className="border-[#e43d11] text-[#e43d11] hover:bg-[#e43d11] hover:text-white"
            >
              <User className="w-4 h-4 mr-2" />
              Account
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              onClick={onOpenAccount}
              variant="ghost"
              size="icon"
              className="text-[#e43d11]"
            >
              <User className="w-5 h-5" />
            </Button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#e43d11] hover:text-[#c73410] transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-['Poppins:Regular',sans-serif] text-[#e43d11] hover:bg-[#ece9e2] block px-3 py-2 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}