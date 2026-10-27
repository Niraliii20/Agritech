import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Package, Clock, CheckCircle2, Truck, ShieldAlert, ArrowRight, Eye, Edit2 } from 'lucide-react';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState('Confirmed');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('[AdminOrders] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenStatusModal = (ord) => {
    setSelectedOrder(ord);
    setStatusToUpdate(ord.status);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      await api.put(`/orders/${selectedOrder._id}/status`, { status: statusToUpdate });
      setIsModalOpen(false);
      fetchOrders();
    } catch (err) {
      console.error('[AdminOrders] Error updating status:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading marketplace fulfillment queue..." />;
  }

  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-amber-100 text-amber-800',
      Confirmed: 'bg-blue-100 text-blue-800',
      Processing: 'bg-indigo-100 text-indigo-800',
      Shipped: 'bg-purple-100 text-purple-800',
      Delivered: 'bg-emerald-100 text-emerald-800',
      Cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full uppercase">
          Fulfillment & Logistics
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
          Marketplace Orders & Dispatch Tracking
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Review customer seed and equipment orders, update transit statuses, and confirm farm dispatch.
        </p>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-100">
              <tr>
                <th className="p-4 sm:p-5">Order ID</th>
                <th className="p-4 sm:p-5">Farmer Customer</th>
                <th className="p-4 sm:p-5">Shipping Destination</th>
                <th className="p-4 sm:p-5">Total Amount</th>
                <th className="p-4 sm:p-5">Status</th>
                <th className="p-4 sm:p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((ord) => (
                <tr key={ord._id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-gray-900">
                    #{ord._id.toString().slice(-6).toUpperCase()}
                    <span className="text-[10px] text-gray-400 block font-normal">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </td>
                  <td className="p-4 sm:p-5">
                    <p className="font-bold text-gray-900">{ord.user?.fullName || 'Farmer'}</p>
                    <p className="text-[11px] text-gray-400">{ord.user?.mobileNumber}</p>
                  </td>
                  <td className="p-4 sm:p-5 text-gray-600">
                    <p className="truncate max-w-xs">{ord.shippingAddress?.street}</p>
                    <p className="text-[11px] text-gray-400">
                      {ord.shippingAddress?.district}, {ord.shippingAddress?.state} ({ord.shippingAddress?.pincode})
                    </p>
                  </td>
                  <td className="p-4 sm:p-5 font-black text-emerald-800">₹{ord.totalAmount}</td>
                  <td className="p-4 sm:p-5">{getStatusBadge(ord.status)}</td>
                  <td className="p-4 sm:p-5 text-right">
                    <button
                      onClick={() => handleOpenStatusModal(ord)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 font-bold rounded-xl transition-colors text-[11px]"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Update Order #${selectedOrder?._id.toString().slice(-6).toUpperCase()}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-gray-50 space-y-1 text-xs">
            <p className="text-gray-500">
              Customer: <strong className="text-gray-900">{selectedOrder?.user?.fullName}</strong>
            </p>
            <p className="text-gray-500">
              Amount: <strong className="text-emerald-800">₹{selectedOrder?.totalAmount}</strong>
            </p>
            <p className="text-gray-500">
              Items: {selectedOrder?.items?.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Set Delivery Status</label>
            <select
              value={statusToUpdate}
              onChange={(e) => setStatusToUpdate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none bg-white"
            >
              {ORDER_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-5 py-2 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              {updating ? 'Updating...' : 'Save Status'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OrderManagementPage;
