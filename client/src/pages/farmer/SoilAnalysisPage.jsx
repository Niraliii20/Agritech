import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  FlaskConical,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Save,
  Trash2,
  FileText,
  ShieldAlert,
  ArrowRight,
  Info,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const SOIL_TYPES = ['Alluvial', 'Black', 'Red', 'Laterite', 'Sandy', 'Clay', 'Loamy', 'Other'];
const CROPS = ['Wheat', 'Rice / Paddy', 'Cotton', 'Sugarcane', 'Soybean', 'Mustard', 'Tomato', 'Potato', 'Maize', 'Pulses'];

const SoilAnalysisPage = () => {
  const [loading, setLoading] = useState(true);
  const [farms, setFarms] = useState([]);
  const [reports, setReports] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    sampleName: 'North Block Soil Sample',
    farmId: '',
    soilType: 'Loamy',
    targetCrop: 'Wheat',
    ph: 6.8,
    nitrogen: 320,
    phosphorus: 19,
    potassium: 210,
    moisture: 38,
    organicCarbon: 0.65,
  });

  const [analysisResult, setAnalysisResult] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [farmsRes, reportsRes] = await Promise.all([api.get('/farms'), api.get('/soil')]);
      setFarms(farmsRes.data.farms || []);
      setReports(reportsRes.data.reports || []);

      if (farmsRes.data.farms?.length > 0 && !formData.farmId) {
        setFormData((prev) => ({ ...prev, farmId: farmsRes.data.farms[0]._id }));
      }

      // Initial analysis
      runCalculation(formData);
    } catch (err) {
      console.error('[Soil] Error fetching soil data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const runCalculation = async (data) => {
    try {
      const res = await api.post('/soil/analyze', data);
      setAnalysisResult(res.data.data);
    } catch (err) {
      console.error('[Soil] Analysis error:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updated = {
      ...formData,
      [name]: ['ph', 'nitrogen', 'phosphorus', 'potassium', 'moisture', 'organicCarbon'].includes(name)
        ? Number(value)
        : value,
    };
    setFormData(updated);
    runCalculation(updated);
  };

  const handleSaveReport = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await api.post('/soil', formData);
      setSaveSuccess(true);
      const reportsRes = await api.get('/soil');
      setReports(reportsRes.data.reports || []);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('[Soil] Error saving report:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReport = async (id) => {
    try {
      await api.delete(`/soil/${id}`);
      setReports(reports.filter((r) => r._id !== id));
    } catch (err) {
      console.error('[Soil] Error deleting report:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading soil diagnostic models and history..." />;
  }

  // Benchmark chart data
  const chartData = [
    {
      metric: 'Nitrogen (N)',
      'Your Sample (kg/ha)': formData.nitrogen,
      'Medium Benchmark': 350,
    },
    {
      metric: 'Phosphorus (P)',
      'Your Sample (kg/ha)': formData.phosphorus,
      'Medium Benchmark': 20,
    },
    {
      metric: 'Potassium (K)',
      'Your Sample (kg/ha)': formData.potassium,
      'Medium Benchmark': 180,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-2">
        <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase">
          Agronomic Soil Health Diagnostics
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Soil Health Analysis & Crop Recommendations
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-3xl leading-relaxed">
          Input your laboratory soil testing card values or field estimates to evaluate nutrient balance, pH acidity/alkalinity,
          and receive tailored soil amendments.
        </p>
      </div>

      {/* Main Analysis Form & Diagnostics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Parameter Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">Soil Card Parameters</h3>
            <span className="text-xs text-emerald-700 font-semibold">Interactive</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Sample / Card Name</label>
              <input
                type="text"
                name="sampleName"
                value={formData.sampleName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-amber-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Soil Type</label>
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-amber-500 outline-none bg-white"
                >
                  {SOIL_TYPES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Target Crop</label>
                <select
                  name="targetCrop"
                  value={formData.targetCrop}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-amber-500 outline-none bg-white"
                >
                  {CROPS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* pH Slider */}
            <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">Soil pH: {formData.ph}</span>
                <span className="text-[11px] font-bold text-amber-800">
                  {formData.ph < 6.0 ? 'Acidic' : formData.ph > 7.5 ? 'Alkaline' : 'Optimal Neutral'}
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="9.5"
                step="0.1"
                name="ph"
                value={formData.ph}
                onChange={handleInputChange}
                className="w-full accent-amber-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>4.0 Acidic</span>
                <span>7.0 Neutral</span>
                <span>9.5 Alkaline</span>
              </div>
            </div>

            {/* N, P, K, Moisture Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Nitrogen (N) kg/ha</label>
                <input
                  type="number"
                  min="50"
                  max="800"
                  name="nitrogen"
                  value={formData.nitrogen}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Phosphorus (P) kg/ha</label>
                <input
                  type="number"
                  min="2"
                  max="100"
                  name="phosphorus"
                  value={formData.phosphorus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Potassium (K) kg/ha</label>
                <input
                  type="number"
                  min="30"
                  max="600"
                  name="potassium"
                  value={formData.potassium}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Soil Moisture (%)</label>
                <input
                  type="number"
                  min="5"
                  max="90"
                  name="moisture"
                  value={formData.moisture}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveReport}
              disabled={saving}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 pt-3"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Archiving...' : 'Save Soil Health Card'}
            </button>

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Soil health card archived to your account history!
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Visual Assessment & Recommendations (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Health Score Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Overall Soil Index</span>
              <h3 className="text-2xl font-black text-gray-900">
                Status:{' '}
                <span
                  className={
                    analysisResult?.status === 'Optimal'
                      ? 'text-emerald-700'
                      : analysisResult?.status === 'Moderate'
                      ? 'text-amber-700'
                      : 'text-rose-700'
                  }
                >
                  {analysisResult?.status}
                </span>
              </h3>
              <p className="text-xs text-gray-500">
                Target Crop: <strong className="text-gray-800">{formData.targetCrop}</strong> on {formData.soilType} soil
              </p>
            </div>

            <div className="w-24 h-24 rounded-3xl bg-emerald-50 border-4 border-emerald-500 text-emerald-800 flex flex-col items-center justify-center shrink-0 shadow-sm">
              <span className="text-3xl font-black">{analysisResult?.healthScore || 85}</span>
              <span className="text-[10px] uppercase font-bold text-emerald-700">out of 100</span>
            </div>
          </div>

          {/* Recharts Bar Chart: Nutrient Comparison */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Nutrient Comparison with Agronomic Benchmarks
              </h4>
              <span className="text-[11px] text-gray-400">Values in kg/ha</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Your Sample (kg/ha)" fill="#2E7D32" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Medium Benchmark" fill="#FBC02D" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recommendations List */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Agronomic Soil Management Recommendations
            </h4>
            <div className="space-y-2">
              {analysisResult?.recommendations?.map((rec, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100/70 text-xs flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="text-emerald-950 font-medium leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Statutory Agronomic Notice */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Important Guidance:</strong> This software assessment is based on farmer-entered values and
              standard agronomy reference models. AgriTech does not physically measure soil without laboratory assays.
              For commercial fertilizer purchasing, consult your local Krishi Vigyan Kendra (KVK) or district soil testing laboratory.
            </p>
          </div>
        </div>
      </div>

      {/* Previous Reports Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Previous Soil Analysis Reports ({reports.length})</h3>

        {reports.length === 0 ? (
          <p className="text-xs text-gray-400 py-4 text-center">No previous soil reports archived yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((rep) => (
              <div
                key={rep._id}
                className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 hover:border-emerald-300 transition-colors space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-900">{rep.sampleName}</span>
                    <button
                      onClick={() => handleDeleteReport(rep._id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Crop: <strong className="text-gray-800">{rep.targetCrop}</strong> • {rep.soilType} Soil
                  </p>
                  <div className="grid grid-cols-4 gap-1 pt-2 text-center text-[10px]">
                    <div className="bg-white p-1.5 rounded-lg border border-gray-100">
                      <span className="text-gray-400 block">pH</span>
                      <strong className="text-gray-800">{rep.ph}</strong>
                    </div>
                    <div className="bg-white p-1.5 rounded-lg border border-gray-100">
                      <span className="text-gray-400 block">N</span>
                      <strong className="text-gray-800">{rep.nitrogen}</strong>
                    </div>
                    <div className="bg-white p-1.5 rounded-lg border border-gray-100">
                      <span className="text-gray-400 block">P</span>
                      <strong className="text-gray-800">{rep.phosphorus}</strong>
                    </div>
                    <div className="bg-white p-1.5 rounded-lg border border-gray-100">
                      <span className="text-gray-400 block">K</span>
                      <strong className="text-gray-800">{rep.potassium}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-emerald-800">Score: {rep.healthScore}/100</span>
                  <span className="text-gray-400">{new Date(rep.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SoilAnalysisPage;
