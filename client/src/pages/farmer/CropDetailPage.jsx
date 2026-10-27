import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Sprout,
  ArrowLeft,
  Calendar,
  Droplets,
  Plus,
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  Layers,
  MapPin,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const GROWTH_STAGES = [
  'Land Preparation',
  'Sowing',
  'Germination',
  'Vegetative Growth',
  'Flowering',
  'Fruiting',
  'Harvesting',
  'Completed',
];

const CropDetailPage = () => {
  const { id } = useParams();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [activityType, setActivityType] = useState('irrigation');
  const [submitting, setSubmitting] = useState(false);

  const [activityForm, setActivityForm] = useState({
    name: '',
    amount: '',
    quantity: '',
    note: '',
    stage: '',
    date: new Date().toISOString().split('T')[0],
  });

  const fetchCropDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/crops/${id}`);
      setCrop(res.data.crop);
    } catch (err) {
      console.error('[CropDetail] Error fetching crop:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCropDetails();
  }, [id]);

  const handleUpdateStage = async (stage) => {
    try {
      const res = await api.put(`/crops/${crop._id}`, { growthStage: stage });
      setCrop(res.data.crop);
    } catch (err) {
      console.error('[CropDetail] Failed to update stage:', err);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        type: activityType,
        ...activityForm,
      };
      await api.post(`/crops/${crop._id}/activity`, payload);
      setIsActivityModalOpen(false);
      fetchCropDetails();
    } catch (err) {
      console.error('[CropDetail] Error logging activity:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading crop details, lifecycle progression, and activity logs..." />;
  }

  if (!crop) {
    return (
      <div className="text-center py-12 space-y-3">
        <h3 className="text-lg font-bold text-gray-900">Crop record not found</h3>
        <Link to="/crops" className="text-emerald-700 font-bold text-sm">
          ← Back to Crop Management
        </Link>
      </div>
    );
  }

  const currentStageIndex = GROWTH_STAGES.indexOf(crop.growthStage);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link to="/crops" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800">
          <ArrowLeft className="w-4 h-4" /> Back to All Crops
        </Link>
      </div>

      {/* Main Crop Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg shrink-0">
              <Sprout className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">
                {crop.category} • {crop.healthStatus} Health
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">{crop.cropName}</h1>
              <p className="text-xs text-gray-500">
                Variety: <strong className="text-emerald-800 font-bold">{crop.variety}</strong> | Farm:{' '}
                <strong className="text-gray-800">{crop.farm?.farmName || 'Assigned Farm'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActivityType('irrigation');
                setIsActivityModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold hover:bg-sky-100 transition-colors flex items-center gap-1.5"
            >
              <Droplets className="w-4 h-4 text-sky-600" />
              Log Irrigation
            </button>
            <button
              onClick={() => {
                setActivityType('fertilizer');
                setIsActivityModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-amber-600" />
              Log Fertilizer
            </button>
          </div>
        </div>

        {/* 8-Stage Growth Stepper */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Agronomic Lifecycle Stages (Click to Advance)
            </h4>
            <span className="text-xs font-bold text-emerald-700">{crop.growthPercentage}% Complete</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {GROWTH_STAGES.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <button
                  key={stage}
                  onClick={() => handleUpdateStage(stage)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    isCurrent
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-102 font-bold'
                      : isPast
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100/70 font-semibold'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold opacity-75">Stage {idx + 1}</span>
                    {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                  </div>
                  <p className="text-xs font-bold leading-tight truncate">{stage}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Sowing Date</span>
            <span className="font-bold text-gray-900 mt-0.5 block">
              {crop.sowingDate ? new Date(crop.sowingDate).toLocaleDateString('en-IN') : 'N/A'}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Expected Harvest</span>
            <span className="font-bold text-gray-900 mt-0.5 block">
              {crop.expectedHarvestDate ? new Date(crop.expectedHarvestDate).toLocaleDateString('en-IN') : 'N/A'}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Field Area</span>
            <span className="font-bold text-emerald-800 mt-0.5 block">
              {crop.fieldArea} {crop.areaUnit}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Crop Health Status</span>
            <span className="font-bold text-emerald-800 mt-0.5 block">{crop.healthStatus}</span>
          </div>
        </div>
      </div>

      {/* Activity Logs (Irrigation & Fertilizer) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Irrigation Logs */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                <Droplets className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Irrigation History</h3>
            </div>
            <button
              onClick={() => {
                setActivityType('irrigation');
                setIsActivityModalOpen(true);
              }}
              className="text-xs font-bold text-sky-700 hover:text-sky-800"
            >
              + Log Water
            </button>
          </div>

          <div className="space-y-2.5">
            {crop.irrigationLogs && crop.irrigationLogs.length > 0 ? (
              crop.irrigationLogs.map((log, i) => (
                <div key={i} className="p-3 rounded-2xl bg-sky-50/50 border border-sky-100/60 text-xs space-y-0.5">
                  <div className="flex items-center justify-between font-bold text-sky-950">
                    <span>{log.amount}</span>
                    <span className="text-[10px] text-gray-500 font-normal">
                      {new Date(log.date).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  {log.notes && <p className="text-[11px] text-sky-800">{log.notes}</p>}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-4 text-center">No irrigation activities logged yet.</p>
            )}
          </div>
        </div>

        {/* Fertilizer Logs */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Fertilizer & Nutrition Logs</h3>
            </div>
            <button
              onClick={() => {
                setActivityType('fertilizer');
                setIsActivityModalOpen(true);
              }}
              className="text-xs font-bold text-amber-700 hover:text-amber-800"
            >
              + Log Fertilizer
            </button>
          </div>

          <div className="space-y-2.5">
            {crop.fertilizerLogs && crop.fertilizerLogs.length > 0 ? (
              crop.fertilizerLogs.map((log, i) => (
                <div key={i} className="p-3 rounded-2xl bg-amber-50/50 border border-amber-100/60 text-xs space-y-0.5">
                  <div className="flex items-center justify-between font-bold text-amber-950">
                    <span>{log.name}</span>
                    <span className="text-[10px] text-gray-500 font-normal">
                      {new Date(log.date).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-900 font-medium">{log.quantity}</p>
                  {log.notes && <p className="text-[11px] text-gray-600">{log.notes}</p>}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-4 text-center">No fertilizer applications logged yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Activity Modal */}
      <Modal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        title={
          activityType === 'irrigation'
            ? 'Log Irrigation Application'
            : activityType === 'fertilizer'
            ? 'Log Fertilizer / Nutrition Application'
            : 'Record Field Observation'
        }
      >
        <form onSubmit={handleAddActivity} className="space-y-4">
          {activityType === 'irrigation' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Water Depth / Details</label>
              <input
                type="text"
                required
                value={activityForm.amount}
                onChange={(e) => setActivityForm({ ...activityForm, amount: e.target.value })}
                placeholder="e.g. Crown Root Irrigation (5 cm standing water) or 2 hours drip"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none"
              />
            </div>
          )}

          {activityType === 'fertilizer' && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fertilizer Name</label>
                <input
                  type="text"
                  required
                  value={activityForm.name}
                  onChange={(e) => setActivityForm({ ...activityForm, name: e.target.value })}
                  placeholder="e.g. Neem Coated Urea / DAP / NPK 19:19:19"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Applied Quantity & Method</label>
                <input
                  type="text"
                  required
                  value={activityForm.quantity}
                  onChange={(e) => setActivityForm({ ...activityForm, quantity: e.target.value })}
                  placeholder="e.g. 45 kg/acre top dressing before watering"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Date</label>
            <input
              type="date"
              required
              value={activityForm.date}
              onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Notes / Field Observation</label>
            <textarea
              rows={2}
              value={activityForm.note}
              onChange={(e) => setActivityForm({ ...activityForm, note: e.target.value })}
              placeholder="e.g. Field responded well, vigorous tillering"
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsActivityModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              {submitting ? 'Saving...' : 'Save Activity'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CropDetailPage;
