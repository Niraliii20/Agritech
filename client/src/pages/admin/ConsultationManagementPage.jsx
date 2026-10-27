import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { UserCheck, MessageSquare, Send, CheckCircle2, Clock, Eye } from 'lucide-react';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ConsultationManagementPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/experts/admin/all');
      setConsultations(res.data.consultations || []);
    } catch (err) {
      console.error('[AdminConsultations] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleOpenReplyModal = (c) => {
    setSelectedConsultation(c);
    setReplyText(c.expertReply || '');
    setIsModalOpen(true);
  };

  const handlePostReply = async (e) => {
    e.preventDefault();
    if (!selectedConsultation) return;
    setSubmitting(true);
    try {
      await api.put(`/experts/admin/reply/${selectedConsultation._id}`, {
        reply: replyText,
        status: 'Answered',
      });
      setIsModalOpen(false);
      fetchConsultations();
    } catch (err) {
      console.error('[AdminConsultations] Reply error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading expert queries queue..." />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
        <span className="text-xs font-bold text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full uppercase">
          Advisory Moderation
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
          Expert Consultation Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Review questions from farmers regarding pest attacks, soil imbalances, and fertilizer recommendations.
        </p>
      </div>

      <div className="space-y-4">
        {consultations.map((c) => (
          <div
            key={c._id}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  Farmer: {c.farmer?.fullName} ({c.farmer?.district}, {c.farmer?.state})
                </h4>
                <p className="text-xs text-gray-400">
                  Target Crop: <strong className="text-emerald-800">{c.cropType}</strong> • Assigned Specialist:{' '}
                  <strong>{c.expert?.name}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                    c.status === 'Answered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {c.status}
                </span>
                <button
                  onClick={() => handleOpenReplyModal(c)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  {c.expertReply ? 'Edit Advisory' : 'Post Advisory Reply'}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400">Farmer's Question</span>
              <p className="text-gray-900 font-medium leading-relaxed">{c.question}</p>
            </div>

            {c.expertReply && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-800">Posted Advisory Response</span>
                <p className="text-emerald-950 font-medium leading-relaxed">{c.expertReply}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Post Advisory for ${selectedConsultation?.farmer?.fullName}`}
      >
        <form onSubmit={handlePostReply} className="space-y-4">
          <div className="p-3 rounded-2xl bg-gray-50 text-xs space-y-1">
            <p className="text-gray-500 font-bold">Query: {selectedConsultation?.cropType}</p>
            <p className="text-gray-700 italic leading-relaxed">"{selectedConsultation?.question}"</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Expert Agronomic Recommendations & Prescription
            </label>
            <textarea
              rows={5}
              required
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Detail specific chemical or organic measures, spray timing, fertilizer doses, and irrigation adjustments..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none"
            />
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
              className="px-5 py-2 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              {submitting ? 'Posting...' : 'Publish Advisory Response'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ConsultationManagementPage;
