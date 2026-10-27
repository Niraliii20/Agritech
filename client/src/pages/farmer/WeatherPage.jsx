import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import {
  CloudSun,
  Search,
  Droplets,
  Wind,
  Compass,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  ShieldAlert,
  Sun,
  CloudRain,
  Cloud,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const POPULAR_AGRI_HUBS = [
  { name: 'Ludhiana', state: 'Punjab' },
  { name: 'Pune', state: 'Maharashtra' },
  { name: 'Nashik', state: 'Maharashtra' },
  { name: 'Karnal', state: 'Haryana' },
  { name: 'Varanasi', state: 'Uttar Pradesh' },
  { name: 'Jaipur', state: 'Rajasthan' },
  { name: 'Nagpur', state: 'Maharashtra' },
  { name: 'Indore', state: 'Madhya Pradesh' },
];

const WeatherPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDistrict = searchParams.get('district') || searchParams.get('q') || 'Ludhiana';

  const [query, setQuery] = useState(initialDistrict);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWeather = async (location) => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/weather?q=${encodeURIComponent(location)}`);
      setWeather(res.data.data);
    } catch (err) {
      setError('Unable to retrieve weather data for the specified location.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(initialDistrict);
  }, [initialDistrict]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      fetchWeather(query.trim());
    }
  };

  const handleSelectHub = (hub) => {
    setQuery(hub.name);
    setSearchParams({ q: hub.name });
    fetchWeather(hub.name);
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
        <div className="max-w-2xl">
          <span className="text-xs font-bold text-sky-800 bg-sky-100 px-3 py-1 rounded-full uppercase">
            Hyper-Local Weather Forecast & Agro-Advisory
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1.5">
            Agricultural Weather Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Search any Indian district or farming hub for real-time temperature, rainfall risks, and spraying windows.
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter district or city name (e.g. Ludhiana, Pune, Karnal)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-sm outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-xs transition-colors shrink-0"
          >
            Check Weather
          </button>
        </form>

        {/* Quick Hub Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 custom-scrollbar text-xs">
          <span className="text-gray-400 font-bold uppercase text-[10px] shrink-0">Popular Hubs:</span>
          {POPULAR_AGRI_HUBS.map((hub) => (
            <button
              key={hub.name}
              onClick={() => handleSelectHub(hub)}
              className="px-3 py-1 rounded-xl bg-gray-50 hover:bg-sky-50 hover:text-sky-700 text-gray-700 border border-gray-200 font-medium shrink-0 transition-colors"
            >
              {hub.name}, {hub.state}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Retrieving atmospheric parameters and generating agronomic advisories..." />
      ) : error ? (
        <div className="p-6 bg-red-50 text-red-700 rounded-3xl border border-red-200 text-sm text-center">
          {error}
        </div>
      ) : weather ? (
        <div className="space-y-6">
          {/* Main Weather Hero Card */}
          <div className="bg-gradient-to-br from-sky-900 via-sky-800 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Column: Temperature & Condition */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-200">
                  <MapPin className="w-4 h-4 text-amber-300" />
                  <span>
                    {weather.city}, {weather.district} • {weather.state}
                  </span>
                </div>

                <div className="flex items-baseline gap-4">
                  <span className="text-6xl sm:text-7xl font-black tracking-tight">{weather.temp}°C</span>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">{weather.condition}</h3>
                    <p className="text-xs text-sky-200 font-medium">Feels like {weather.feels_like}°C</p>
                  </div>
                </div>

                <p className="text-sm text-sky-100/90 leading-relaxed max-w-lg">{weather.description}</p>

                {/* Sub Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-sky-800/80 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-sky-300 font-bold block">Humidity</span>
                    <span className="text-base font-black text-white">{weather.humidity}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-sky-300 font-bold block">Wind Velocity</span>
                    <span className="text-base font-black text-white">{weather.wind_speed} km/h</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-sky-300 font-bold block">Rain Probability</span>
                    <span className="text-base font-black text-amber-300">{weather.rainfall_prob}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-sky-300 font-bold block">Pressure</span>
                    <span className="text-base font-black text-white">{weather.pressure} hPa</span>
                  </div>
                </div>
              </div>

              {/* Right Column: 5-Day Daily Forecast Strip */}
              <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-200">5-Day Outlook</h4>
                <div className="space-y-2">
                  {weather.forecast?.map((day) => (
                    <div
                      key={day.day}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0"
                    >
                      <span className="font-bold text-white w-20">{day.day}</span>
                      <span className="text-sky-200 text-[11px] truncate w-24 text-center">{day.condition}</span>
                      <span className="text-amber-300 text-[11px] font-semibold">
                        {day.rainfall_prob > 0 ? `${day.rainfall_prob}% rain` : 'Dry'}
                      </span>
                      <span className="font-black text-white text-right w-16">
                        {day.temp_max}° / {day.temp_min}°
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Three Dedicated Agricultural Advisory Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Irrigation Advisory */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Irrigation Advisory</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {weather.advisory?.irrigation ||
                  'Maintain optimal moisture according to crop growth stage. Evapotranspiration is normal.'}
              </p>
              <div className="pt-2 text-[11px] font-bold text-blue-700 bg-blue-50/70 p-2.5 rounded-xl">
                Status: {weather.rainfall_prob > 50 ? 'Postpone Irrigation' : 'Safe to Irrigate'}
              </div>
            </div>

            {/* 2. Spraying Window Advisory */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Wind className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Foliar Spraying Window</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {weather.advisory?.spraying ||
                  'Morning calm winds provide a favorable window for foliar fertilizer and bio-pesticides.'}
              </p>
              <div className="pt-2 text-[11px] font-bold text-emerald-700 bg-emerald-50/70 p-2.5 rounded-xl">
                Status: {weather.wind_speed > 20 ? 'High Wind - Delay Spray' : 'Favorable Spray Conditions'}
              </div>
            </div>

            {/* 3. Harvesting Advisory */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Harvest & Field Operations</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {weather.advisory?.harvesting ||
                  'Dry atmospheric conditions suitable for grain cutting, threshing, and sun drying.'}
              </p>
              <div className="pt-2 text-[11px] font-bold text-amber-800 bg-amber-50/70 p-2.5 rounded-xl">
                Status: {weather.rainfall_prob > 40 ? 'Check Moisture Before Bagging' : 'Optimal Field Work'}
              </div>
            </div>
          </div>

          {/* Data Transparency Disclosure */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 text-xs text-gray-500 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Source Notice:</strong> {weather.dataSource}.{' '}
              {weather.isDemonstrationData
                ? weather.disclaimer
                : 'Live regional satellite readings from OpenWeather API.'}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default WeatherPage;
