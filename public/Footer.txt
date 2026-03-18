import React from 'react';
import { Twitter, Facebook, Instagram, Linkedin, Heart, Flag, MapPin, Mail } from 'lucide-react';

interface FooterProps {
  onPrivacyClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onPrivacyClick }) => {
  return (
    <footer className="bg-stone-900 text-stone-400 py-16 px-4 border-t border-stone-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 relative z-10">

        {/* Brand Section */}
        <div className="col-span-1 lg:col-span-1">
          <div className="flex flex-col">
            <span className="font-display font-bold text-2xl text-stone-100 tracking-tight leading-none">Communitree</span>
            <span className="text-xs font-medium text-stone-500 uppercase tracking-widest mt-1">Flag Pledge</span>
          </div>
          <p className="text-sm leading-relaxed text-stone-400 mb-6">
            This pledge is a community-led initiative promoting respect for the Indian National Flag by communitree.
          </p>
          <div className="flex gap-3">
            <SocialLink href="https://www.linkedin.com/company/communitree-india/?originalSubdomain=in" icon={<Linkedin size={18} />} color="hover:bg-blue-700" label="LinkedIn" />
            <SocialLink href="https://www.instagram.com/communitree.india/?hl=en" icon={<Instagram size={18} />} color="hover:bg-pink-600" label="Instagram" />
            <SocialLink href="https://www.facebook.com/communitree.co.in/" icon={<Facebook size={18} />} color="hover:bg-blue-600" label="Facebook" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-stone-100 mb-6 uppercase text-xs tracking-wider flex items-center gap-2">
            <span className="w-8 h-px bg-orange-500"></span> Navigation
          </h3>
          <ul className="space-y-3 text-sm">
            <li><a href="https://communitree.in/" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors flex items-center gap-2">Communitree Website</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors flex items-center gap-2">About the Mission</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors flex items-center gap-2">Flag Code of India</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors flex items-center gap-2">Gallery</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-bold text-stone-100 mb-6 uppercase text-xs tracking-wider flex items-center gap-2">
            <span className="w-8 h-px bg-white"></span> Legal
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <button
                onClick={onPrivacyClick}
                className="hover:text-orange-500 transition-colors text-left"
              >
                Privacy Policy
              </button>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-stone-100 mb-6 uppercase text-xs tracking-wider flex items-center gap-2">
            <span className="w-8 h-px bg-green-500"></span> Contact
          </h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-stone-500 mt-0.5 shrink-0" />
              <span>
                Chennai, Tamil Nadu<br />
                India
              </span>
            </li>

          </ul>
        </div>

      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">

        <p className="text-stone-600">&copy; {new Date().getFullYear()} Communitree.</p>
      </div>
    </footer>
  );
};

const SocialLink: React.FC<{ href: string; icon: React.ReactNode; color: string; label: string }> = ({ href, icon, color, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={`w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:text-white transition-all transform hover:scale-110 ${color}`}
  >
    {icon}
  </a>
);