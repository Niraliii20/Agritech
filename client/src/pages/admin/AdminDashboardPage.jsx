import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Users,
  Sprout,
  ShoppingBag,
  Package,
  UserCheck,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('[Admin] Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading AgriTech administrator telemetry..." />;
  }

  const metrics = stats?.metrics || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>System Administrator Control Panel</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">AgriTech Platform Overview</h1>
        <p className="text-xs sm:text-sm text-gray-300">
          Monitor platform metrics, user registrations, marketplace orders, and expert agricultural advisories.
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Registered Farmers</span>
          <p className="text-3xl font-black text-gray-900">{metrics.totalFarmers || 0}</p>
          <Link to="/admin/users" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 block pt-1">
            Manage Users →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Sprout className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Active Field Crops</span>
          <p className="text-3xl font-black text-gray-900">{metrics.totalCrops || 0}</p>
          <p className="text-xs text-gray-400">Across {metrics.totalFarms || 0} Farms</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Orders Processed</span>
          <p className="text-3xl font-black text-gray-900">{metrics.totalOrders || 0}</p>
          <Link to="/admin/orders" className="text-xs font-bold text-teal-700 hover:text-teal-800 block pt-1">
            Manage Orders →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Consultation Queries</span>
          <p className="text-3xl font-black text-gray-900">{metrics.totalConsultations || 0}</p>
          <Link to="/admin/consultations" className="text-xs font-bold text-amber-700 hover:text-amber-800 block pt-1">
            {metrics.pendingConsultations || 0} Pending Review →
          </Link>
        </div>
      </div>

      {/* Quick Admin Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/admin/users"
          className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all text-center space-y-1"
        >
          <Users className="w-5 h-5 text-emerald-600 mx-auto" />
          <h4 className="text-xs font-bold text-gray-900">User Management</h4>
          <p className="text-[11px] text-gray-400">View roles & accounts</p>
        </Link>
        <Link
          to="/admin/products"
          className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all text-center space-y-1"
        >
          <ShoppingBag className="w-5 h-5 text-teal-600 mx-auto" />
          <h4 className="text-xs font-bold text-gray-900">Market Inventory</h4>
          <p className="text-[11px] text-gray-400">Add & modify products</p>
        </Link>
        <Link
          to="/admin/orders"
          className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all text-center space-y-1"
        >
          <Package className="w-5 h-5 text-blue-600 mx-auto" />
          <h4 className="text-xs font-bold text-gray-900">Order Tracking</h4>
          <p className="text-[11px] text-gray-400">Update shipping stages</p>
        </Link>
        <Link
          to="/admin/consultations"
          className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all text-center space-y-1"
        >
          <UserCheck className="w-5 h-5 text-indigo-600 mx-auto" />
          <h4 className="text-xs font-bold text-gray-900">Expert Queries</h4>
          <p className="text-[11px] text-gray-400">Post agronomic replies</p>
        </Link>
      </div>

      {/* Recent Orders & Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Recent Customer Orders</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-emerald-700">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recentOrders?.map((ord) => (
              <div
                key={ord._id}
                className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-gray-900">
                    Order #{ord._id.toString().slice(-6).toUpperCase()} • ₹{ord.totalAmount}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {ord.user?.fullName} ({ord.user?.district}, {ord.user?.state})
                  </p>
                </div>
                <span className="font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                  {ord.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Recently Registered Farmers</h3>
            <Link to="/admin/users" className="text-xs font-bold text-emerald-700">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recentUsers?.map((u) => (
              <div
                key={u._id}
                className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-gray-900">{u.fullName}</p>
                  <p className="text-[11px] text-gray-500">
                    {u.district}, {u.state} • {u.mobileNumber}
                  </p>
                </div>
                <span className="text-[10px] text-gray-400">
                  {new Date(u.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
