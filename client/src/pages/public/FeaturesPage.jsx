import React from 'react';
import { Link } from 'react-router-dom';
import { CloudSun, FlaskConical, Sprout, Bug, ShoppingBag, UserCheck, CheckCircle2 } from 'lucide-react';

const FeaturesPage = () => {
  const sections = [
    {
      id: 'weather',
      title: 'Hyper-Local Weather & Agro-Advisory',
      description:
        'Accurate weather forecasting built specifically for Indian agricultural districts. Integrates OpenWeather API with intelligent agro-advisory models that translate weather variables into concrete farming actions.',
      icon: CloudSun,
      color: 'text-sky-600 bg-sky-50',
      bullets: [
        '5-Day multi-day rainfall, humidity, and temperature trends',
        'Specialized spraying windows (wind speed & precipitation risk)',
        'Evapotranspiration and scheduled irrigation alerts',
        'Transparent fallback data for all major Indian farming districts',
      ],
      link: '/weather',
    },
    {
      id: 'crop',
      title: 'Full Lifecycle Crop Management',
      description:
        'Track every phase of your crops across 8 recognized agronomic growth stages from land preparation to post-harvest storage.',
      icon: Sprout,
      color: 'text-emerald-600 bg-emerald-50',
      bullets: [
        'Growth stage stepper with visual completion percentages',
        'Detailed logs for irrigation dates, water depth, and fertigation',
        'Fertilizer basal and top-dressing dose recorder',
        'Health status indicators (Excellent, Good, Fair, Critical)',
      ],
      link: '/crops',
    },
    {
      id: 'soil',
      title: 'Soil Health Analysis & Agronomic Score',
      description:
        'Input soil test card readings (pH, Nitrogen, Phosphorus, Potassium, Moisture) to evaluate nutrient bioavailability and receive soil management guidance.',
      icon: FlaskConical,
      color: 'text-amber-600 bg-amber-50',
      bullets: [
        'Visual nutrient bar charts comparing user inputs with Indian ICAR benchmarks',
        'Specific liming and gypsum recommendations for acidic and alkaline soils',
        'Target crop planting suggestions before sowing',
        'Permanent digital soil health card archiving',
      ],
      link: '/soil-analysis',
    },
    {
      id: 'pest',
      title: 'Pest & Crop Disease Early Alert System',
      description:
        'Symptom-based diagnostic matching for prominent crop afflictions like Yellow Rust, Rice Blast, Pink Bollworm, and fungal blights.',
      icon: Bug,
      color: 'text-rose-600 bg-rose-50',
      bullets: [
        'Severity scoring: Low, Medium, High alert badges',
        'Integrated IPM (Integrated Pest Management) biological and chemical solutions',
        'Treatment history tracker to observe spray efficacy',
        'Transparent preliminary diagnosis disclosure',
      ],
      link: '/pest-disease',
    },
    {
      id: 'market',
      title: 'Agricultural Input Marketplace',
      description:
        'Browse high-germination certified seeds, balanced water-soluble fertilizers, automated drip kits, and protective spray equipment.',
      icon: ShoppingBag,
      color: 'text-teal-600 bg-teal-50',
      bullets: [
        'Categorized catalog with price in Rupees (₹) and stock quantities',
        'Interactive shopping cart with quantity adjustments',
        'Demonstration checkout flow for seamless test ordering',
        'Order status tracking: Confirmed, Processing, Shipped, Delivered',
      ],
      link: '/marketplace',
    },
    {
      id: 'expert',
      title: 'Expert Consultation & Community Forum',
      description:
        'Connect directly with certified agricultural scientists, or share local farming innovations with fellow farmers across India.',
      icon: UserCheck,
      color: 'text-indigo-600 bg-indigo-50',
      bullets: [
        'Directory of verified agronomists, plant pathologists, and irrigation engineers',
        'Structured consultation request form with status tracking',
        'Community discussion threads categorized by crop and region',
        'Peer farmer upvoting and localized experience sharing',
      ],
      link: '/expert-advice',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
          Comprehensive Smart Farming Features
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Explore all the purpose-built modules designed to increase crop yield, reduce input costs, and protect your farm.
        </p>
      </div>

      <div className="space-y-12">
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          const isEven = idx % 2 === 0;
          return (
            <div
              key={sec.id}
              className={`bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xs flex flex-col ${
                isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center gap-10`}
            >
              <div className="flex-1 space-y-5">
                <div className={`w-14 h-14 rounded-2xl ${sec.color} flex items-center justify-center`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{sec.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{sec.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {sec.bullets.map((b) => (
                    <div key={b} className="flex items-start gap-2 text-xs text-gray-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                  <Link
                    to={sec.link}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition-all"
                  >
                    Open {sec.title.split('&')[0].trim()}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturesPage;
