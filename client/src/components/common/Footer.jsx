import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Phone, Mail, MapPin, Heart, ShieldAlert, Award, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Agri<span className="text-emerald-400">Tech</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Empowering Indian farmers with intelligent digital agricultural tools, hyper-local weather advisory,
              crop health tracking, precision soil management, and direct expert consultations.
            </p>
            <div className="pt-2 text-xs text-gray-400 space-y-1.5">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                Krishi Vigyan Kendra Complex, New Delhi & Pune, India
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                Toll-Free Kisan Advisory Line: 1800-180-1551 (Demo)
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                support@agritech.in
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Core Modules</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/weather" className="hover:text-emerald-400 transition-colors">
                  Weather Forecasting
                </Link>
              </li>
              <li>
                <Link to="/crops" className="hover:text-emerald-400 transition-colors">
                  Crop Lifecycle Tracker
                </Link>
              </li>
              <li>
                <Link to="/soil-analysis" className="hover:text-emerald-400 transition-colors">
                  Soil Health Analysis
                </Link>
              </li>
              <li>
                <Link to="/pest-disease" className="hover:text-emerald-400 transition-colors">
                  Pest & Disease Alerts
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="hover:text-emerald-400 transition-colors">
                  Agricultural Marketplace
                </Link>
              </li>
              <li>
                <Link to="/expert-advice" className="hover:text-emerald-400 transition-colors">
                  Expert Consultations
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Resources */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/community" className="hover:text-emerald-400 transition-colors">
                  Kisan Community Forum
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-emerald-400 transition-colors">
                  Smart Farming Guide
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  About AgriTech Mission
                </Link>
              </li>
              <li>
                <span className="text-gray-500 cursor-not-allowed">PM-Kisan Scheme Guidance</span>
              </li>
              <li>
                <span className="text-gray-500 cursor-not-allowed">Soil Health Card Portal</span>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Legal & Trust</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="hover:text-emerald-400 transition-colors cursor-pointer">Privacy Policy</span>
              </li>
              <li>
                <span className="hover:text-emerald-400 transition-colors cursor-pointer">Terms of Service</span>
              </li>
              <li>
                <span className="hover:text-emerald-400 transition-colors cursor-pointer">Security Practices</span>
              </li>
              <li>
                <span className="hover:text-emerald-400 transition-colors cursor-pointer">Help & Support</span>
              </li>
              <li>
                <Link to="/login" className="text-amber-400 hover:text-amber-300 font-medium">
                  Administrator Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Alert */}
        <div className="mt-8 p-4 rounded-xl bg-gray-800/80 border border-gray-700/60 text-xs text-gray-400 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-gray-200">Demonstration Platform Disclosure:</strong> AgriTech is designed for
            smart agricultural demonstration and farmer support. Weather recommendations, pest diagnoses, and soil
            health guidance are intended for educational and farm management guidance. For statutory certification or
            large-scale inputs, farmers are advised to consult their nearest Krishi Vigyan Kendra (KVK) or accredited
            soil testing laboratory.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} AgriTech — Smart Farming Management System. Built with passion for Indian agriculture.</p>
          <p className="flex items-center gap-1">
            Empowering Kisan with Digital Innovation <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
