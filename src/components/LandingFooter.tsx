import { Github, Linkedin, Mail } from "lucide-react";

export function LandingFooter() {
  const navigationLinks = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  const socialLinks = [
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Github", icon: Github, href: "#" },
    { name: "Mail", icon: Mail, href: "mailto:contact@hwork.com" },
  ];

  return (
    <footer className="bg-[#e43d11] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h2 className="font-['Poppins:Bold',sans-serif] text-4xl mb-4">
              H-WORK
            </h2>
            <p className="font-['Poppins:Regular',sans-serif] text-white/90 leading-relaxed">
              Organizing homework, timetables and syllabus in one platform.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-['Poppins:SemiBold',sans-serif] text-xl mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="font-['Poppins:Regular',sans-serif] text-white/80 hover:text-white transition-colors inline-block hover:translate-x-1 transition-transform"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-['Poppins:SemiBold',sans-serif] text-xl mb-4">
              Connect
            </h3>
            <ul className="space-y-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="font-['Poppins:Regular',sans-serif] text-white/80 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      {link.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Credits */}
          <div>
            <h3 className="font-['Poppins:SemiBold',sans-serif] text-xl mb-4">
              Credits
            </h3>
            <div className="space-y-2 font-['Poppins:Regular',sans-serif] text-white/80">
              <p>Inspired by Parv</p>
              <p>Design by Aksh</p>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm">
                  Your Privacy Matters
                  <br />
                  Made with ❤️ for students
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-['Poppins:Regular',sans-serif] text-white/70 text-sm text-center md:text-left">
              © 2025 H-WORK. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm font-['Poppins:Regular',sans-serif]">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}