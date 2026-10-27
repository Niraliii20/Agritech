import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Sprout,
  Plus,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Edit2,
  Trash2,
  Filter,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const CROP_CATEGORIES = ['Cereal', 'Pulse', 'Oilseed', 'Fiber', 'Cash Crop', 'Vegetable', 'Fruit', 'Spice', 'Fodder'];
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
const HEALTH_STATUSES = ['Excellent', 'Good', 'Fair', 'Needs Attention', 'Critical'];

const CropsPage = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const [formData, setFormData] = useState({
    farmId: '',
    cropName: '',
    variety: '',
    category: 'Cereal',
    sowingDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: '',
    fieldArea: '',
    areaUnit: 'Acres',
    growthStage: 'Sowing',
    healthStatus: 'Good',
    image: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cropsRes, farmsRes] = await Promise.all([api.get('/crops'), api.get('/farms')]);
      setCrops(cropsRes.data.crops || []);
      setFarms(farmsRes.data.farms || []);
      if (farmsRes.data.farms?.length > 0 && !formData.farmId) {
        setFormData((prev) => ({ ...prev, farmId: farmsRes.data.farms[0]._id }));
      }
    } catch (err) {
      console.error('[Crops] Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setSelectedCrop(null);
    setFormData({
      farmId: farms[0]?._id || '',
      cropName: '',
      variety: '',
      category: 'Cereal',
      sowingDate: new Date().toISOString().split('T')[0],
      expectedHarvestDate: '',
      fieldArea: '',
      areaUnit: farms[0]?.areaUnit || 'Acres',
      growthStage: 'Sowing',
      healthStatus: 'Good',
      image: '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (crop) => {
    setSelectedCrop(crop);
    setFormData({
      farmId: crop.farm?._id || crop.farm,
      cropName: crop.cropName,
      variety: crop.variety || '',
      category: crop.category || 'Cereal',
      sowingDate: crop.sowingDate ? new Date(crop.sowingDate).toISOString().split('T')[0] : '',
      expectedHarvestDate: crop.expectedHarvestDate
        ? new Date(crop.expectedHarvestDate).toISOString().split('T')[0]
        : '',
      fieldArea: crop.fieldArea,
      areaUnit: crop.areaUnit || 'Acres',
      growthStage: crop.growthStage,
      healthStatus: crop.healthStatus,
      image: crop.image || '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSaveCrop = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (selectedCrop) {
        await api.put(`/crops/${selectedCrop._id}`, formData);
      } else {
        await api.post('/crops', formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save crop record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCrop) return;
    try {
      await api.delete(`/crops/${selectedCrop._id}`);
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('[Crops] Error deleting crop:', err);
    }
  };

  const filteredCrops = filterCategory === 'All' ? crops : crops.filter((c) => c.category === filterCategory);

  if (loading) {
    return <LoadingSpinner text="Loading your crop management records..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Crop Lifecycle Management</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Monitor crop stages, track sowing and expected harvest dates, and log irrigation and nutrition.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          disabled={farms.length === 0}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Crop
        </button>
      </div>

      {farms.length === 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
          <span>You must register at least one farm plot before adding crops.</span>
          <Link to="/farms" className="font-bold underline ml-2">
            Register Farm Now →
          </Link>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar text-xs">
        <span className="font-bold text-gray-400 uppercase tracking-wider text-[11px] shrink-0 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        <button
          onClick={() => setFilterCategory('All')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
            filterCategory === 'All'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          All ({crops.length})
        </button>
        {CROP_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
              filterCategory === cat
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Crops Cards Grid */}
      {filteredCrops.length === 0 ? (
        <EmptyState
          icon={Sprout}
          title="No crops found"
          description="Register your active crops to monitor growth progression, irrigation schedules, and nutrient health."
          actionText="Add New Crop"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <div
              key={crop._id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image banner or fallback pattern */}
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                <img
                  src={
                    crop.image ||
                    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={crop.cropName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-gray-900 shadow-xs">
                  {crop.category}
                </div>
                <div className="absolute top-3 right-3 bg-emerald-700/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs">
                  {crop.growthPercentage}%
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-snug">{crop.cropName}</h3>
                    <p className="text-xs text-emerald-700 font-semibold">{crop.variety}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Farm: {crop.farm?.farmName || 'Assigned Farm'}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(crop)}
                      className="p-1.5 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Edit Crop"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCrop(crop);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Crop"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Growth Stage Progress */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-700 capitalize">{crop.growthStage}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                      Health: {crop.healthStatus}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${crop.growthPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Sowing / Harvest dates */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Sown Date</span>
                    <span className="font-bold text-gray-800">
                      {crop.sowingDate ? new Date(crop.sowingDate).toLocaleDateString('en-IN') : 'N/A'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Field Area</span>
                    <span className="font-bold text-gray-800">
                      {crop.fieldArea} {crop.areaUnit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <Link
                  to={`/crops/${crop._id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-emerald-600 hover:text-white text-gray-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-gray-100"
                >
                  View Details & Activity Logs <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Crop Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCrop ? 'Edit Crop Details' : 'Add New Crop Record'}
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSaveCrop} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Select Farm Plot</label>
            <select
              required
              value={formData.farmId}
              onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none bg-white"
            >
              {farms.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.farmName} ({f.totalArea} {f.areaUnit} • {f.district})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Crop Name</label>
              <input
                type="text"
                required
                value={formData.cropName}
                onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                placeholder="e.g. Sharbati Wheat"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Variety</label>
              <input
                type="text"
                value={formData.variety}
                onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                placeholder="e.g. PBW-502 Certified"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Crop Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none bg-white"
              >
                {CROP_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Field Area (Acres)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={formData.fieldArea}
                onChange={(e) => setFormData({ ...formData, fieldArea: e.target.value })}
                placeholder="5.0"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Sowing Date</label>
              <input
                type="date"
                required
                value={formData.sowingDate}
                onChange={(e) => setFormData({ ...formData, sowingDate: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Expected Harvest Date</label>
              <input
                type="date"
                value={formData.expectedHarvestDate}
                onChange={(e) => setFormData({ ...formData, expectedHarvestDate: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Current Growth Stage</label>
              <select
                value={formData.growthStage}
                onChange={(e) => setFormData({ ...formData, growthStage: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none bg-white"
              >
                {GROWTH_STAGES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Crop Health Status</label>
              <select
                value={formData.healthStatus}
                onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none bg-white"
              >
                {HEALTH_STATUSES.map((hs) => (
                  <option key={hs} value={hs}>
                    {hs}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Image URL (Optional)</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              {submitting ? 'Saving...' : selectedCrop ? 'Update Crop' : 'Create Crop Record'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Crop Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <strong className="text-gray-900">{selectedCrop?.cropName}</strong>?
          </p>
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
            This will permanently remove this crop's irrigation logs, fertilizer records, and growth history.
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              className="px-4 py-2 text-sm font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CropsPage;
