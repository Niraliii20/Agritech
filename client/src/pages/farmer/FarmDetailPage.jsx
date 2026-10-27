import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Sprout,
  MapPin,
  Droplets,
  Calendar,
  Layers,
  ArrowLeft,
  Plus,
  CloudSun,
  FlaskConical,
  CheckCircle2,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const FarmDetailPage = () => {
  const { id } = useParams();
  const [farm, setFarm] = useState(null);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/farms/${id}`);
        setFarm(res.data.farm);
        setCrops(res.data.crops || []);
      } catch (err) {
        console.error('[FarmDetail] Error loading farm:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmDetails();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Loading farm details and crop records..." />;
  }

  if (!farm) {
    return (
      <div className="text-center py-12 space-y-3">
        <h3 className="text-lg font-bold text-gray-900">Farm record not found</h3>
        <Link to="/farms" className="text-emerald-700 font-bold text-sm">
          ← Back to Farms List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link to="/farms" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800">
          <ArrowLeft className="w-4 h-4" /> Back to My Farms
        </Link>
      </div>

      {/* Main Farm Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">
              Registered Agricultural Holding
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{farm.farmName}</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              {farm.villageOrLocation ? `${farm.villageOrLocation}, ` : ''}
              {farm.district}, {farm.state}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/weather?district=${encodeURIComponent(farm.district)}`}
              className="px-4 py-2 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold hover:bg-sky-100 transition-colors flex items-center gap-1.5"
            >
              <CloudSun className="w-4 h-4 text-sky-600" />
              Farm Weather
            </Link>
            <Link
              to={`/crops`}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add Crop
            </Link>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Area</span>
            <span className="text-lg font-black text-gray-900 mt-1 block">
              {farm.totalArea} {farm.areaUnit}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Soil Classification</span>
            <span className="text-lg font-black text-emerald-800 mt-1 block">{farm.soilType} Soil</span>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Irrigation Infrastructure</span>
            <span className="text-sm font-bold text-gray-900 mt-1 block truncate">{farm.irrigationMethod}</span>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Water Source</span>
            <span className="text-sm font-bold text-gray-900 mt-1 block truncate">
              {farm.waterSource || 'Borewell'}
            </span>
          </div>
        </div>

        {farm.notes && (
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs text-gray-700">
            <p className="font-bold text-emerald-950 mb-1">Plot Strategy & Notes:</p>
            <p className="leading-relaxed">{farm.notes}</p>
          </div>
        )}
      </div>

      {/* Associated Crops on this Farm */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Associated Crops ({crops.length})</h3>
            <p className="text-xs text-gray-500">Crops currently registered and tracked on this specific farm plot.</p>
          </div>
          <Link to="/crops" className="text-xs font-bold text-emerald-700 hover:text-emerald-800">
            Manage All Crops →
          </Link>
        </div>

        {crops.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 text-xs text-gray-500">
            No crops currently assigned to this farm plot. Click "Add Crop" to begin tracking.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {crops.map((crop) => (
              <div
                key={crop._id}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{crop.cropName}</h4>
                      <p className="text-[11px] text-gray-500">{crop.variety}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                    {crop.healthStatus}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 capitalize">{crop.growthStage}</span>
                    <span className="font-bold text-emerald-700">{crop.growthPercentage}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${crop.growthPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    Field Area: {crop.fieldArea} {crop.areaUnit}
                  </span>
                  <Link to={`/crops/${crop._id}`} className="font-bold text-emerald-700 hover:text-emerald-800">
                    Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmDetailPage;
