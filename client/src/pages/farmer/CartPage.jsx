import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldAlert,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.fullName || '',
    phone: user?.mobileNumber || '',
    street: 'Farm Village Plot 12, Main Canal Road',
    district: user?.district || 'Ludhiana',
    state: user?.state || 'Punjab',
    pincode: '141001',
    notes: 'Please phone prior to delivery at farm gate.',
  });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const orderPayload = {
        items: items.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod: 'Cash on Delivery (Demo Mode)',
        notes: shippingAddress.notes,
      };

      const res = await api.post('/orders', orderPayload);
      clearCart();
      setIsCheckoutModalOpen(false);
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place demonstration order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-8">
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Cart is Empty"
          description="Explore certified agricultural seeds, bio-fertilizers, and drip equipment in the AgriTech Marketplace."
          actionText="Browse Marketplace"
          onAction={() => navigate('/marketplace')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Review your selected agricultural inputs and proceed to demonstration checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.product._id}
              className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={
                    item.product.imageUrl ||
                    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={item.product.name}
                  className="w-20 h-20 rounded-2xl object-cover bg-gray-50 shrink-0"
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase">
                    {item.product.category}
                  </span>
                  <h4 className="text-sm font-bold text-gray-900 leading-snug">{item.product.name}</h4>
                  <p className="text-xs text-gray-400">
                    ₹{item.product.price} / {item.product.unit}
                  </p>
                </div>
              </div>

              {/* Quantity Counter & Line Total */}
              <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    className="p-1 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-gray-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    className="p-1 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-base font-black text-emerald-800">₹{item.product.price * item.quantity}</p>
                </div>

                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">Order Summary</h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-bold text-gray-900">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Direct Farm Delivery</span>
                <span className="font-bold text-emerald-700">FREE</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Applicable GST / Taxes</span>
                <span className="font-bold text-gray-900">Included</span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between text-base">
                <span className="font-black text-gray-900">Total Payable</span>
                <span className="font-black text-emerald-800 text-xl">₹{cartTotal}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCheckoutModalOpen(true)}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2"
            >
              Proceed to Demo Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Demonstration Notice */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/70 text-[11px] text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Demonstration Flow Active
              </p>
              <p className="leading-relaxed text-amber-800">
                This transaction runs on demonstration mode. No real credit card or bank payment is required.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Checkout Modal */}
      <Modal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        title="Demonstration Checkout & Shipping"
      >
        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Confirm farm shipping address for test delivery. Order will be recorded immediately.</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
              <input
                type="text"
                required
                value={shippingAddress.fullName}
                onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mobile Contact</label>
              <input
                type="tel"
                required
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Village Plot / Farm Street</label>
            <input
              type="text"
              required
              value={shippingAddress.street}
              onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">District</label>
              <input
                type="text"
                required
                value={shippingAddress.district}
                onChange={(e) => setShippingAddress({ ...shippingAddress, district: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">State</label>
              <input
                type="text"
                required
                value={shippingAddress.state}
                onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pincode</label>
              <input
                type="text"
                required
                value={shippingAddress.pincode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Payment Method</label>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800">
              Cash on Delivery (Simulated Demo Checkout) — Payable: ₹{cartTotal}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCheckoutModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              {submitting ? 'Placing Order...' : 'Confirm Demo Order'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CartPage;
