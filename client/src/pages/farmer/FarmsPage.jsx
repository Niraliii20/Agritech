import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Sprout, Plus, MapPin, Droplets, Trash2, Edit2, ArrowRight, AlertCircle, Layers } from 'lucide-react';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const SOIL_TYPES = ['Alluvial', 'Black', 'Red', 'Laterite', 'Sandy', 'Clay', 'Loamy', 'Other'];
const IRRIGATION_METHODS = ['Drip', 'Sprinkler', 'Canal / Flood', 'Rainfed', 'Tube Well / Borewell', 'Other'];
const AREA_UNITS = ['Acres', 'Hectares', 'Bigha', 'Guntha'];

const FarmsPage = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    farmName: '',
    totalArea: '',
    areaUnit: 'Acres',
    state: 'Punjab',
    district: '',
    villageOrLocation: '',
    soilType: 'Loamy',
    irrigationMethod: 'Tube Well / Borewell',
    waterSource: 'Deep Borewell with Solar Pump',
    notes: '',
  });

  const fetchFarms = async () => {
    try {
      setLoading(true);
      const res = await api.get('/farms');
      setFarms(res.data.farms || []);
    } catch (err) {
      console.error('[Farms] Error loading farms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleOpenAddModal = () => {
    setSelectedFarm(null);
    setFormData({
      farmName: '',
      totalArea: '',
      areaUnit: 'Acres',
      state: 'Punjab',
      district: '',
      villageOrLocation: '',
      soilType: 'Loamy',
      irrigationMethod: 'Tube Well / Borewell',
      waterSource: 'Deep Borewell',
      notes: '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (farm) => {
    setSelectedFarm(farm);
    setFormData({
      farmName: farm.farmName,
      totalArea: farm.totalArea,
      areaUnit: farm.areaUnit,
      state: farm.state,
      district: farm.district,
      villageOrLocation: farm.villageOrLocation || '',
      soilType: farm.soilType,
      irrigationMethod: farm.irrigationMethod,
      waterSource: farm.waterSource || '',
      notes: farm.notes || '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSaveFarm = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (selectedFarm) {
        await api.put(`/farms/${selectedFarm._id}`, formData);
      } else {
        await api.post('/farms', formData);
      }
      setIsModalOpen(false);
      fetchFarms();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save farm record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedFarm) return;
    try {
      await api.delete(`/farms/${selectedFarm._id}`);
      setIsDeleteModalOpen(false);
      fetchFarms();
    } catch (err) {
      console.error('[Farms] Failed to delete farm:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your farm profiles..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Farm Profile Management</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Register, monitor, and configure multiple agricultural plots and soil characteristics.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Register New Farm
        </button>
      </div>

      {/* Farms List */}
      {farms.length === 0 ? (
        <EmptyState
          icon={Sprout}
          title="No farms registered yet"
          description="Register your first farm plot to begin managing crops, soil health reports, and receiving location-specific weather alerts."
          actionText="Register New Farm"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <div
              key={farm._id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(farm)}
                      className="p-2 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Edit Farm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFarm(farm);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Farm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 leading-snug">{farm.farmName}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {farm.district}, {farm.state}
                  </p>
                </div>

                {/* Attributes Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-gray-50">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Area</span>
                    <span className="font-bold text-gray-900">
                      {farm.totalArea} {farm.areaUnit}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Soil Type</span>
                    <span className="font-bold text-emerald-800">{farm.soilType}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Irrigation</span>
                    <span className="font-bold text-gray-900 truncate block">{farm.irrigationMethod}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Active Crops</span>
                    <span className="font-bold text-emerald-800">{farm.cropsCount || 0} Crops</span>
                  </div>
                </div>

                {farm.notes && (
                  <p className="text-xs text-gray-500 italic line-clamp-2 bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100/50">
                    "{farm.notes}"
                  </p>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100">
                <Link
                  to={`/farms/${farm._id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-emerald-600 hover:text-white text-gray-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  View Details & Crops <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Farm Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedFarm ? 'Edit Farm Profile' : 'Register New Farm'}
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSaveFarm} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Farm Name</label>
            <input
              type="text"
              required
              value={formData.farmName}
              onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
              placeholder="e.g. Green Valley Agro Estate"
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Total Area</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={formData.totalArea}
                onChange={(e) => setFormData({ ...formData, totalArea: e.target.value })}
                placeholder="10.5"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Area Unit</label>
              <select
                value={formData.areaUnit}
                onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none bg-white"
              >
                {AREA_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">State</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Punjab"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">District</label>
              <input
                type="text"
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                placeholder="Ludhiana"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Village / Location</label>
            <input
              type="text"
              value={formData.villageOrLocation}
              onChange={(e) => setFormData({ ...formData, villageOrLocation: e.target.value })}
              placeholder="e.g. Jagraon Block, Sector 4"
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Soil Type</label>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none bg-white"
              >
                {SOIL_TYPES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Irrigation Method</label>
              <select
                value={formData.irrigationMethod}
                onChange={(e) => setFormData({ ...formData, irrigationMethod: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none bg-white"
              >
                {IRRIGATION_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Water Source Details</label>
            <input
              type="text"
              value={formData.waterSource}
              onChange={(e) => setFormData({ ...formData, waterSource: e.target.value })}
              placeholder="e.g. Deep Borewell with Solar Pump"
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Notes / Cultivation Strategy</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Crop rotation between Wheat and Paddy"
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
              {submitting ? 'Saving...' : selectedFarm ? 'Update Farm' : 'Create Farm'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Farm Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <strong className="text-gray-900">{selectedFarm?.farmName}</strong>?
          </p>
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
            <strong>Warning:</strong> Deleting this farm will also remove all associated crops and field logs. This
            action cannot be undone.
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

export default FarmsPage;
