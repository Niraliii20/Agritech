import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  UserCheck,
  Award,
  Star,
  MessageSquare,
  Plus,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ExpertConsultationPage = () => {
  const { user } = useAuth();
  const [experts, setExperts] = useState([]);
  const [myConsultations, setMyConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' or 'my-queries'

  const [form, setForm] = useState({
    cropType: 'Wheat',
    farmLocation: user?.district ? `${user.district}, ${user.state}` : 'Ludhiana, Punjab',
    question: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expRes, consRes] = await Promise.all([api.get('/experts'), api.get('/experts/my-consultations')]);
      setExperts(expRes.data.experts || []);
      setMyConsultations(consRes.data.consultations || []);
    } catch (err) {
      console.error('[Expert] Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenConsult = (expert) => {
    setSelectedExpert(expert);
    setForm({
      cropType: 'Wheat',
      farmLocation: user?.district ? `${user.district}, ${user.state}` : 'Ludhiana, Punjab',
      question: '',
    });
    setIsModalOpen(true);
  };

  const handleSubmitConsultation = async (e) => {
    e.preventDefault();
    if (!selectedExpert) return;
    setSubmitting(true);
    try {
      await api.post('/experts/consult', {
        expertId: selectedExpert._id,
        ...form,
      });
      setIsModalOpen(false);
      setActiveTab('my-queries');
      fetchData();
    } catch (err) {
      console.error('[Expert] Submit failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Connecting to agricultural expert directory..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
        <div className="max-w-2xl space-y-1">
          <span className="text-xs font-bold text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full uppercase">
            Certified Agronomy Guidance
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Agricultural Expert Consultation
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Directly connect with certified agronomists, plant pathologists, and irrigation engineers from reputed Indian
            institutes (PAU Ludhiana, MPKV Rahuri, IARI Pusa).
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'directory'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Verified Experts Directory ({experts.length})
          </button>
          <button
            onClick={() => setActiveTab('my-queries')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'my-queries'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            My Consultations & Replies ({myConsultations.length})
          </button>
        </div>
      </div>

      {/* Directory Tab */}
      {activeTab === 'directory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((exp) => (
            <div
              key={exp._id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={exp.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={exp.name}
                    className="w-16 h-16 rounded-2xl object-cover bg-gray-100 shrink-0"
                  />
                  <div>
                    <h3 className="text-base font-bold text-gray-900 leading-tight">{exp.name}</h3>
                    <p className="text-xs text-emerald-700 font-semibold">{exp.specialization}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{exp.institution}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-600 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{exp.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{exp.experienceYears} Years Exp</span>
                  <span>•</span>
                  <span>{exp.consultationsCount}+ Solved</span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  "{exp.bio}"
                </p>

                <div className="text-[11px] text-gray-500">
                  <span className="font-bold text-gray-700">Languages:</span> {exp.languages?.join(', ')}
                </div>
              </div>

              <button
                onClick={() => handleOpenConsult(exp)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Ask Question / Consult
              </button>
            </div>
          ))}
        </div>
      )}

      {/* My Queries Tab */}
      {activeTab === 'my-queries' && (
        <div className="space-y-4">
          {myConsultations.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">No consultation requests yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Have a question about pest damage, soil nutrients, or crop irrigation? Ask a verified agricultural expert.
              </p>
              <button
                onClick={() => setActiveTab('directory')}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Explore Experts Directory
              </button>
            </div>
          ) : (
            myConsultations.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        Consultation with {c.expert?.name || 'Assigned Expert'}
                      </h4>
                      <p className="text-xs text-gray-400">
                        Crop: <strong className="text-gray-700">{c.cropType}</strong> • Location: {c.farmLocation}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                      c.status === 'Answered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                {/* Farmer Question */}
                <div className="p-3.5 rounded-2xl bg-gray-50 text-xs space-y-1">
                  <span className="font-bold text-gray-700 uppercase text-[10px]">Your Question:</span>
                  <p className="text-gray-900 leading-relaxed font-medium">{c.question}</p>
                </div>

                {/* Expert Reply */}
                {c.expertReply ? (
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs space-y-2">
                    <div className="flex items-center justify-between text-emerald-950 font-bold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Expert Advisory Response ({c.expert?.name})
                      </span>
                      {c.repliedAt && (
                        <span className="text-[10px] text-emerald-700 font-normal">
                          {new Date(c.repliedAt).toLocaleDateString('en-IN')}
                        </span>
                      )}
                    </div>
                    <p className="text-emerald-900 leading-relaxed">{c.expertReply}</p>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-amber-50 text-xs text-amber-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Your question is queued with the expert. Average turnaround is within 24 hours.</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Consult Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Consult ${selectedExpert?.name || 'Expert'}`}
      >
        <form onSubmit={handleSubmitConsultation} className="space-y-4">
          <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs space-y-1">
            <p className="font-bold text-indigo-950">{selectedExpert?.title}</p>
            <p className="text-indigo-800 text-[11px]">{selectedExpert?.qualification} • {selectedExpert?.institution}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Crop Type</label>
              <input
                type="text"
                required
                value={form.cropType}
                onChange={(e) => setForm({ ...form, cropType: e.target.value })}
                placeholder="e.g. Wheat, Basmati Rice"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Farm Location</label>
              <input
                type="text"
                required
                value={form.farmLocation}
                onChange={(e) => setForm({ ...form, farmLocation: e.target.value })}
                placeholder="District, State"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Question / Issue Details</label>
            <textarea
              rows={4}
              required
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              placeholder="Explain the symptoms, soil type, irrigation schedule, or fertilizer dose you need guidance on..."
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
              className="px-6 py-2.5 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Send Consultation Request'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExpertConsultationPage;
