import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ShoppingBag, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Package } from 'lucide-react';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CATEGORIES = [
  'Seeds',
  'Fertilizers',
  'Farming Tools',
  'Irrigation Equipment',
  'Organic Farming Products',
  'Crop Protection Products',
];

const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    category: 'Seeds',
    description: '',
    price: 500,
    originalPrice: 650,
    unit: '10 kg Bag',
    brand: 'AgriTech Select',
    stockQuantity: 50,
    inStock: true,
    imageUrl: '',
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products?limit=100');
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('[AdminProducts] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setForm({
      name: '',
      category: 'Seeds',
      description: '',
      price: 500,
      originalPrice: 650,
      unit: '10 kg Bag',
      brand: 'AgriTech Select',
      stockQuantity: 50,
      inStock: true,
      imageUrl: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setSelectedProduct(p);
    setForm({
      name: p.name,
      category: p.category,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice || '',
      unit: p.unit || 'Unit',
      brand: p.brand || 'AgriTech Select',
      stockQuantity: p.stockQuantity || 50,
      inStock: p.inStock,
      imageUrl: p.imageUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (selectedProduct) {
        await api.put(`/products/${selectedProduct._id}`, form);
      } else {
        await api.post('/products', form);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('[AdminProducts] Save failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product from marketplace inventory?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('[AdminProducts] Delete failed:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading marketplace inventory..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
        <div>
          <span className="text-xs font-bold text-teal-800 bg-teal-100 px-3 py-1 rounded-full uppercase">
            Marketplace Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
            Product Listings & Inventory
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Add, update pricing, restock seeds and fertilizers, and organize catalog categories.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Product Listing
        </button>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-100">
              <tr>
                <th className="p-4 sm:p-5">Product</th>
                <th className="p-4 sm:p-5">Category</th>
                <th className="p-4 sm:p-5">Price (₹)</th>
                <th className="p-4 sm:p-5">Stock</th>
                <th className="p-4 sm:p-5">Rating</th>
                <th className="p-4 sm:p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-gray-900">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.imageUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=150&q=80'}
                        alt={p.name}
                        className="w-10 h-10 rounded-xl object-cover bg-gray-50 shrink-0"
                      />
                      <div>
                        <p>{p.name}</p>
                        <p className="text-[11px] text-gray-400 font-normal">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 text-gray-600">{p.category}</td>
                  <td className="p-4 sm:p-5 font-black text-emerald-800">₹{p.price}</td>
                  <td className="p-4 sm:p-5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {p.inStock ? `${p.stockQuantity} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="p-4 sm:p-5 text-gray-700 font-semibold">{p.rating} ★</td>
                  <td className="p-4 sm:p-5 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 text-gray-400 hover:text-emerald-700 rounded-lg hover:bg-emerald-50"
                      title="Edit Product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="p-1.5 text-gray-400 hover:text-red-700 rounded-lg hover:bg-red-50"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct ? 'Edit Product Listing' : 'Add New Marketplace Product'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Title</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Brand Name</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Price (₹)</label>
              <input
                type="number"
                required
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Original Price (₹)</label>
              <input
                type="number"
                min="0"
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Unit Description</label>
              <input
                type="text"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                placeholder="25 kg Bag"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
            <textarea
              rows={3}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={form.stockQuantity}
                onChange={(e) => setForm({ ...form, stockQuantity: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Image URL</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none"
              />
            </div>
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
              disabled={submitting}
              className="px-5 py-2 text-sm font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
            >
              {submitting ? 'Saving...' : 'Save Listing'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductManagementPage;
