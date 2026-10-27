import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import {
  Sprout,
  CloudSun,
  FlaskConical,
  Bug,
  ShoppingBag,
  UserCheck,
  Calendar,
  MapPin,
  ArrowRight,
  TrendingUp,
  Droplets,
  Wind,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DashboardPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [weather, setWeather] = useState(null);
  const [soilReport, setSoilReport] = useState(null);
  const [pestAlerts, setPestAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [farmsRes, cropsRes, weatherRes, soilRes, pestRes, notifRes] = await Promise.all([
          api.get('/farms'),
          api.get('/crops?status=Active'),
          api.get(`/weather?q=${user?.district || 'Ludhiana'}`),
          api.get('/soil'),
          api.get('/pest/recent'),
          api.get('/notifications'),
        ]);

        setFarms(farmsRes.data.farms || []);
        setCrops(cropsRes.data.crops || []);
        setWeather(weatherRes.data.data || null);
        setSoilReport(soilRes.data.reports?.[0] || null);
        setPestAlerts(pestRes.data.alerts || []);
        setNotifications(notifRes.data.notifications || []);
      } catch (err) {
        console.error('[Dashboard] Error fetching dashboard summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return <LoadingSpinner text="Loading your farm intelligence dashboard..." size="lg" />;
  }

  const currentDateFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Prepare chart data for crops
  const cropStageChartData = crops.map((c) => ({
    name: c.cropName.split(' ')[0],
    progress: c.growthPercentage,
    stage: c.growthStage,
  }));

  const COLORS = ['#1B5E20', '#2E7D32', '#4CAF50', '#81C784', '#FBC02D'];

  return (
    <div className="space-y-8">
      {/* A. Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Smart Farming Management System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              {t('dashboard.welcome')}, {user?.fullName}!
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-100 font-medium">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-300" />
                {user?.district ? `${user.district}, ${user.state}` : 'Ludhiana, Punjab'}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-300" />
                {currentDateFormatted}
              </span>
            </div>
          </div>

          {/* Quick Action Add Crop / Farm */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/farms"
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-emerald-700" />
              {t('dashboard.addFarm')}
            </Link>
            <Link
              to="/crops"
              className="px-4 py-2.5 rounded-xl bg-amber-400 text-gray-950 font-bold text-xs sm:text-sm hover:bg-amber-300 transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              {t('dashboard.addCrop')}
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Link
          to="/weather"
          className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all group flex flex-col items-center text-center gap-2"
        >
          <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CloudSun className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-gray-800">{t('dashboard.checkWeather')}</span>
        </Link>

        <Link
          to="/soil-analysis"
          className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all group flex flex-col items-center text-center gap-2"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FlaskConical className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-gray-800">{t('dashboard.analyzeSoil')}</span>
        </Link>

        <Link
          to="/crops"
          className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all group flex flex-col items-center text-center gap-2"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sprout className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-gray-800">Crops Lifecycle</span>
        </Link>

        <Link
          to="/pest-disease"
          className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md hover:border-rose-300 transition-all group flex flex-col items-center text-center gap-2"
        >
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Bug className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-gray-800">Pest Alerts</span>
        </Link>

        <Link
          to="/marketplace"
          className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md hover:border-teal-300 transition-all group flex flex-col items-center text-center gap-2"
        >
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-gray-800">{t('dashboard.browseMarket')}</span>
        </Link>

        <Link
          to="/expert-advice"
          className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all group flex flex-col items-center text-center gap-2"
        >
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UserCheck className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-gray-800">{t('dashboard.consultExpert')}</span>
        </Link>
      </div>

      {/* Main Grid: Weather Overview + Farm Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* B. Weather Overview (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <CloudSun className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">{t('dashboard.weatherOverview')}</h3>
                <p className="text-xs text-gray-500">
                  {weather?.city}, {weather?.state}
                </p>
              </div>
            </div>
            <Link to="/weather" className="text-xs font-bold text-emerald-700 hover:text-emerald-800">
              Details →
            </Link>
          </div>

          {/* Current Temp and Metrics */}
          <div className="flex items-center justify-between py-2 border-y border-gray-100">
            <div>
              <span className="text-4xl sm:text-5xl font-black text-gray-900">{weather?.temp}°C</span>
              <p className="text-xs text-emerald-700 font-semibold mt-0.5">{weather?.condition}</p>
            </div>
            <div className="text-right space-y-1 text-xs text-gray-600">
              <p className="flex items-center justify-end gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span>Humidity: {weather?.humidity}%</span>
              </p>
              <p className="flex items-center justify-end gap-1.5">
                <Wind className="w-3.5 h-3.5 text-teal-500" />
                <span>Wind: {weather?.wind_speed} km/h</span>
              </p>
              <p className="text-amber-700 font-medium">Rain Risk: {weather?.rainfall_prob}%</p>
            </div>
          </div>

          {/* Weather Advisory Snippet */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100/60 text-xs space-y-1">
            <p className="font-bold text-emerald-950 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Agro-Advisory Window
            </p>
            <p className="text-emerald-800 leading-relaxed">
              {weather?.advisory?.irrigation || 'Conditions are favorable for scheduled farm activities.'}
            </p>
          </div>

          {/* 3-Day Mini Strip */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {weather?.forecast?.slice(1, 4).map((f) => (
              <div key={f.day} className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                <p className="font-semibold text-gray-700">{f.day}</p>
                <p className="text-emerald-700 font-bold">{f.temp_max}°C</p>
                <p className="text-[10px] text-gray-500">{f.condition}</p>
              </div>
            ))}
          </div>

          {weather?.isDemonstrationData && (
            <p className="text-[10px] text-gray-400 italic text-center">
              * Demonstration weather model active for {weather?.city}
            </p>
          )}
        </div>

        {/* C. Farm & Crops Overview (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">Farm & Crops Overview</h3>
              <p className="text-xs text-gray-500">Live monitoring of your active agricultural acreage</p>
            </div>
            <Link to="/crops" className="text-xs font-bold text-emerald-700 hover:text-emerald-800">
              {t('dashboard.viewAll')} ({crops.length}) →
            </Link>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                {t('dashboard.totalFarms')}
              </span>
              <p className="text-2xl font-black text-emerald-800 mt-1">{farms.length}</p>
              <p className="text-[10px] text-emerald-700 mt-0.5">
                {farms.reduce((acc, f) => acc + (f.totalArea || 0), 0)} Total Acres
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                {t('dashboard.activeCrops')}
              </span>
              <p className="text-2xl font-black text-emerald-800 mt-1">{crops.length}</p>
              <p className="text-[10px] text-emerald-700 mt-0.5">In Cultivation</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                Soil Health Score
              </span>
              <p className="text-2xl font-black text-amber-800 mt-1">
                {soilReport ? `${soilReport.healthScore}/100` : '85/100'}
              </p>
              <p className="text-[10px] text-amber-700 mt-0.5">
                {soilReport?.status || 'Optimal Range'}
              </p>
            </div>
          </div>

          {/* Active Crops Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Active Crops Progress</h4>
            {crops.length === 0 ? (
              <div className="text-center py-6 text-xs text-gray-400">No active crops registered yet.</div>
            ) : (
              <div className="space-y-3">
                {crops.slice(0, 3).map((crop) => (
                  <div
                    key={crop._id}
                    className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                          <Sprout className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-gray-900">{crop.cropName}</h5>
                          <p className="text-[10px] text-gray-500">{crop.variety}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-700">{crop.growthPercentage}%</span>
                        <p className="text-[10px] text-gray-500 capitalize">{crop.growthStage}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-600 to-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${crop.growthPercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Second Row: D. Soil Health Overview & E. Regional Pest Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* D. Soil Health Overview (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">{t('dashboard.soilStatus')}</h3>
                <p className="text-xs text-gray-500">Based on farmer-entered soil test data</p>
              </div>
            </div>
            <Link to="/soil-analysis" className="text-xs font-bold text-emerald-700 hover:text-emerald-800">
              Run Analysis →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-500 uppercase">Soil pH</p>
              <p className="text-lg font-black text-gray-900 mt-0.5">{soilReport?.ph || 6.8}</p>
              <span className="text-[10px] text-emerald-700 font-semibold">Optimal</span>
            </div>
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-500 uppercase">Nitrogen (N)</p>
              <p className="text-lg font-black text-gray-900 mt-0.5">{soilReport?.nitrogen || 320}</p>
              <span className="text-[10px] text-emerald-700 font-semibold">Medium kg/ha</span>
            </div>
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-500 uppercase">Phosphorus (P)</p>
              <p className="text-lg font-black text-gray-900 mt-0.5">{soilReport?.phosphorus || 19}</p>
              <span className="text-[10px] text-emerald-700 font-semibold">Adequate</span>
            </div>
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-500 uppercase">Potassium (K)</p>
              <p className="text-lg font-black text-gray-900 mt-0.5">{soilReport?.potassium || 210}</p>
              <span className="text-[10px] text-emerald-700 font-semibold">Rich kg/ha</span>
            </div>
          </div>

          {/* Disclosure */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/50 text-[11px] text-amber-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Agronomic Advisory Disclosure
            </p>
            <p className="leading-relaxed text-amber-800">
              Results reflect farmer-entered parameters against standard agricultural benchmarks. Consult your local
              KVK laboratory before applying heavy chemical fertilizers.
            </p>
          </div>
        </div>

        {/* E. Regional Pest Alerts & Notifications (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <Bug className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Regional Alerts & Reminders</h3>
                <p className="text-xs text-gray-500">Pest outbreaks and irrigation notices</p>
              </div>
            </div>
            <Link to="/pest-disease" className="text-xs font-bold text-emerald-700 hover:text-emerald-800">
              Pest Center →
            </Link>
          </div>

          <div className="space-y-3">
            {pestAlerts.length > 0 ? (
              pestAlerts.slice(0, 2).map((alert) => (
                <div
                  key={alert._id}
                  className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-start gap-3"
                >
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs font-bold text-rose-950">{alert.pestOrDiseaseName}</h5>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-900">
                        {alert.severity} Severity
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-800 leading-relaxed">{alert.symptoms}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>No severe pest outbreaks currently active in your block.</span>
              </div>
            )}

            {/* Notification Reminders */}
            {notifications.slice(0, 2).map((notif) => (
              <div
                key={notif._id}
                className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <p className="font-bold text-gray-900">{notif.title}</p>
                  <p className="text-[11px] text-gray-500 line-clamp-1">{notif.message}</p>
                </div>
                <Link to={notif.link || '/notifications'} className="text-[11px] font-bold text-emerald-700 shrink-0 ml-2">
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
