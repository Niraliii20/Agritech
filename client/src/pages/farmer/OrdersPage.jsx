import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Package, Clock, CheckCircle2, Truck, ShieldAlert, ArrowRight, ShoppingBag } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/orders/my');
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error('[Orders] Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading your agricultural input orders..." />;
  }

  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-amber-100 text-amber-800 border-amber-200',
      Confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      Processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      Shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      Cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return (
      <span
        className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
          styles[status] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">My Agricultural Orders</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Track fulfillment and delivery status for certified seeds, fertilizers, and farm equipment.
          </p>
        </div>
        <Link
          to="/marketplace"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <ShoppingBag className="w-4 h-4" />
          Browse Marketplace
        </Link>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders placed yet"
          description="Browse the AgriTech marketplace to order certified seeds, fertilizers, and equipment."
          actionText="Explore Marketplace"
          onAction={() => (window.location.href = '/marketplace')}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      Order #{order._id.toString().slice(-6).toUpperCase()}
                    </h4>
                    <p className="text-xs text-gray-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  <span className="text-base font-black text-emerald-800">₹{order.totalAmount}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=200&q=80'}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-50"
                      />
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-[11px] text-gray-400">
                          Qty: {item.quantity} • ₹{item.price} / {item.unit || 'unit'}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-800">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Delivery Details footer */}
              <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 gap-2">
                <p>
                  Delivering to: <strong className="text-gray-800">{order.shippingAddress?.fullName}</strong> —{' '}
                  {order.shippingAddress?.street}, {order.shippingAddress?.district}, {order.shippingAddress?.state}
                </p>
                <span className="text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px] font-bold self-start sm:self-auto">
                  Demonstration Order
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
