import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  CloudSun,
  FlaskConical,
  Bug,
  ShoppingBag,
  UserCheck,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Compass,
  Star,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const HomePage = () => {
  const { t } = useLanguage();

  const features = [
    {
      title: t('features.weatherTitle'),
      description: t('features.weatherDesc'),
      icon: CloudSun,
      color: 'from-sky-500 to-blue-600',
      badge: 'Real-Time & Forecast',
      path: '/weather',
    },
    {
      title: t('features.soilTitle'),
      description: t('features.soilDesc'),
      icon: FlaskConical,
      color: 'from-amber-500 to-orange-600',
      badge: 'Nutrient Analytics',
      path: '/soil-analysis',
    },
    {
      title: t('features.cropTitle'),
      description: t('features.cropDesc'),
      icon: Sprout,
      color: 'from-emerald-500 to-green-600',
      badge: '8 Growth Stages',
      path: '/crops',
    },
    {
      title: t('features.pestTitle'),
      description: t('features.pestDesc'),
      icon: Bug,
      color: 'from-rose-500 to-red-600',
      badge: 'Early Warning',
      path: '/pest-disease',
    },
    {
      title: t('features.marketTitle'),
      description: t('features.marketDesc'),
      icon: ShoppingBag,
      color: 'from-teal-500 to-emerald-600',
      badge: 'Quality Seeds & Tools',
      path: '/marketplace',
    },
    {
      title: t('features.expertTitle'),
      description: t('features.expertDesc'),
      icon: UserCheck,
      color: 'from-indigo-500 to-purple-600',
      badge: 'Certified Agronomists',
      path: '/expert-advice',
    },
  ];

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-8 pb-16 lg:pt-16 lg:pb-24">
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl opacity-70" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {t('hero.badge')}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                Grow Smarter. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800">
                  Farm Better.
                </span>{' '}
                <br />
                Harvest More.
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-base shadow-lg shadow-emerald-700/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  {t('hero.ctaStart')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/features"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-gray-800 font-bold text-base shadow-xs transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  {t('hero.ctaExplore')}
                  <Compass className="w-5 h-5 text-emerald-600" />
                </Link>
              </div>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600 font-medium">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free for All Indian Farmers</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Available in English & हिन्दी</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>KVK Verified Agronomists</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1595878715977-2e8f8df18ea8?auto=format&fit=crop&w=1000&q=80"
                    alt="Indian farmer inspecting thriving wheat crop in green agricultural field"
                    className="w-full h-96 lg:h-[460px] object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center gap-3 max-w-[260px]">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                    <CloudSun className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400">Agro-Advisory</span>
                    <h5 className="text-xs font-bold text-gray-900 leading-tight">Ludhiana, Punjab</h5>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Optimal Sowing Window</p>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 sm:-right-6 bg-white rounded-2xl p-3.5 shadow-xl border border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Soil Health: 88/100
                    </span>
                    <p className="text-xs font-bold text-gray-900 mt-1">Balanced NPK Levels</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
            All-in-One Agronomic Platform
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {t('features.sectionTitle')}
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">{t('features.sectionSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feat.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link
                    to={feat.path}
                    className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 group-hover:text-emerald-800 group-hover:translate-x-1 transition-all"
                  >
                    Explore Module <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How AgriTech Helps Farmers (3 Steps) */}
      <section className="bg-emerald-950 text-white py-20 rounded-3xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-400 bg-emerald-900/60 px-3 py-1 rounded-full">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{t('howItWorks.title')}</h2>
          <p className="text-emerald-200/80 text-sm">
            Intuitive, accessible, and designed for farmers across all digital literacy levels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="bg-emerald-900/40 rounded-2xl p-8 border border-emerald-800/60 relative">
            <span className="text-5xl font-black text-emerald-500/30 mb-4 block">01</span>
            <h3 className="text-xl font-bold text-white mb-2">{t('howItWorks.step1Title')}</h3>
            <p className="text-sm text-emerald-200/70 leading-relaxed">{t('howItWorks.step1Desc')}</p>
          </div>

          <div className="bg-emerald-900/40 rounded-2xl p-8 border border-emerald-800/60 relative">
            <span className="text-5xl font-black text-emerald-500/30 mb-4 block">02</span>
            <h3 className="text-xl font-bold text-white mb-2">{t('howItWorks.step2Title')}</h3>
            <p className="text-sm text-emerald-200/70 leading-relaxed">{t('howItWorks.step2Desc')}</p>
          </div>

          <div className="bg-emerald-900/40 rounded-2xl p-8 border border-emerald-800/60 relative">
            <span className="text-5xl font-black text-emerald-500/30 mb-4 block">03</span>
            <h3 className="text-xl font-bold text-white mb-2">{t('howItWorks.step3Title')}</h3>
            <p className="text-sm text-emerald-200/70 leading-relaxed">{t('howItWorks.step3Desc')}</p>
          </div>
        </div>
      </section>

      {/* Illustrative Statistics Section (Clearly Labeled) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 mb-8 border-b border-gray-100 gap-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{t('stats.title')}</h3>
              <p className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md inline-block font-semibold mt-1">
                Notice: {t('stats.disclaimer')}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Simulated impact model based on standard crop cycles</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-emerald-700">45,000+</p>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">{t('stats.farmers')}</p>
              <p className="text-[11px] text-gray-400">Across 22 Indian States</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-emerald-700">68,200+</p>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">{t('stats.farms')}</p>
              <p className="text-[11px] text-gray-400">Digital Field Profiles</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-emerald-700">125,000+</p>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">{t('stats.acres')}</p>
              <p className="text-[11px] text-gray-400">Wheat, Rice, Cotton & Veg</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-emerald-700">96.4%</p>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">{t('stats.accuracy')}</p>
              <p className="text-[11px] text-gray-400">Agronomic Advisory Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demonstration Testimonials (Clearly Labeled) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            Demonstration Testimonials
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900">{t('testimonials.title')}</h2>
          <p className="text-xs text-gray-500 italic">{t('testimonials.disclaimer')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 space-y-4">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm text-gray-700 italic leading-relaxed">"{t('testimonials.t1')}"</p>
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-900">{t('testimonials.t1Author')}</p>
              <p className="text-[11px] text-emerald-700">Wheat & Basmati Cultivator</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 space-y-4">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm text-gray-700 italic leading-relaxed">"{t('testimonials.t2')}"</p>
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-900">{t('testimonials.t2Author')}</p>
              <p className="text-[11px] text-emerald-700">Horticulture & Vegetable Farmer</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 space-y-4">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm text-gray-700 italic leading-relaxed">"{t('testimonials.t3')}"</p>
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-900">{t('testimonials.t3Author')}</p>
              <p className="text-[11px] text-emerald-700">Drip Irrigation Pioneer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-900 rounded-3xl p-8 sm:p-14 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold max-w-2xl mx-auto leading-tight">
            Ready to Take Your Farm to the Next Level with AgriTech?
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto">
            Join thousands of Indian farmers who make smarter decisions every day with real-time weather, soil guidance,
            and expert support.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-base shadow-md transition-all hover:scale-105"
            >
              Register Free as Farmer
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-base transition-all"
            >
              Explore Live Demo Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
