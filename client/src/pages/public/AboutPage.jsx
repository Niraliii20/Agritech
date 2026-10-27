import React from 'react';
import { Target, HeartHandshake, ShieldCheck } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
          Our Vision & Mission
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
          Empowering Indian Farmers with Smart Agricultural Technology
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          AgriTech is built to bridge the gap between scientific agricultural research and ground-level farming realities,
          delivering actionable digital tools directly to farmers' hands.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Precision Decisions</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Eliminate guesswork in fertilizer doses, irrigation schedules, and weather preparedness with data-driven
            agronomy benchmarks.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Expert Access</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Directly connect smallholder farmers with certified agronomists and plant pathologists from reputed agricultural
            universities like PAU and MPKV.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Sustainable Farming</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Promote soil regeneration, organic bio-fertilizers, and water conservation technologies to build resilience against
            climate variability.
          </p>
        </div>
      </div>

      <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Open, Modular & Scalable Architecture</h2>
        <p className="text-emerald-100 text-sm leading-relaxed max-w-3xl">
          AgriTech is engineered with a modern full-stack MERN stack (MongoDB, Express, React, Node.js) with modular service
          layers designed for future AI computer vision pest detection, IoT soil sensor hardware, and state government
          e-governance APIs.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-emerald-800 text-center">
          <div>
            <p className="text-2xl font-black text-amber-400">100%</p>
            <p className="text-xs text-emerald-200">MERN Stack</p>
          </div>
          <div>
            <p className="text-2xl font-black text-amber-400">JWT</p>
            <p className="text-xs text-emerald-200">Role-Based Auth</p>
          </div>
          <div>
            <p className="text-2xl font-black text-amber-400">OpenWeather</p>
            <p className="text-xs text-emerald-200">API Integration</p>
          </div>
          <div>
            <p className="text-2xl font-black text-amber-400">Multilingual</p>
            <p className="text-xs text-emerald-200">EN / हिन्दी i18n</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
