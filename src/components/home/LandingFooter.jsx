import React from 'react';
import { Link } from 'react-router-dom';
import {
  GitBranch as Github,
  X as Twitter,
  Globe as Linkedin,
  Instagram,
  Youtube,
  Facebook,
  Mail,
  Shield,
} from 'lucide-react';
import { ROUTES } from '../../constants';

const LandingFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center p-1.5 shadow-lg ring-1 ring-white/20">
                <div className="grid grid-cols-2 gap-1 w-full h-full">
                  <div className="bg-white rounded-sm" />
                  <div className="bg-white/60 rounded-sm" />
                  <div className="bg-white/60 rounded-sm" />
                  <div className="bg-white rounded-sm" />
                </div>
              </div>
              <span className="text-xl font-black tracking-tighter text-white">
                NexaSetu
              </span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed mb-6">
              The high-performance orchestrator for modern engineering
              organizations. Built for clarity, speed, and technical precision.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <SocialLink icon={<Twitter size={18} />} href="https://x.com/nexasetu" />
              <SocialLink icon={<Github size={18} />} href="https://github.com/nexasetu" />
              <SocialLink icon={<Linkedin size={18} />} href="https://linkedin.com/in/yashshinde8585" />
              <SocialLink icon={<Instagram size={18} />} href="https://instagram.com/nexasetu" />
              <SocialLink icon={<Youtube size={18} />} href="https://youtube.com/@nexasetu" />
              <SocialLink icon={<Facebook size={18} />} href="https://facebook.com/nexasetu" />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-6">
              Product
            </h4>
            <ul className="space-y-4">
              <FooterLink to="#features">System</FooterLink>
              <FooterLink to="#pricing">Pricing</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-6">
              Resources
            </h4>
            <ul className="space-y-4">
              <FooterLink to="/docs">Documentation</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-6">
              Company
            </h4>
            <ul className="space-y-4">
              <FooterLink to="/contact">Get help</FooterLink>
              <FooterLink to="/legal">Terms</FooterLink>
              <FooterLink to="/privacy">Privacy</FooterLink>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
            © {currentYear} NexaSetu Systems. All rights reserved.
          </div>
          <div className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] md:text-right">
            Mumbai, Maharashtra, IN • Tel: +91-XXXXXXXXXX
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="text-sm text-white/40 hover:text-white transition-colors"
    >
      {children}
    </Link>
  </li>
);

const SocialLink = ({ icon, href }) => (
  <a
    href={href}
    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
  >
    {icon}
  </a>
);

export default LandingFooter;
