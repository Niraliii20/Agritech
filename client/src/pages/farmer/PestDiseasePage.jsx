import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Bug,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ShieldAlert,
  ArrowRight,
  Search,
  FileText,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const COMMON_PESTS = [
  'Yellow Rust (Puccinia striiformis)',
  'Rice Blast (Magnaporthe oryzae)',
  'Pink Bollworm (Pectinophora gossypiella)',
  'Aphids & Whiteflies',
  'Early / Late Blight',
  'Stem Borer',
  'Powdery Mildew',
  'Termites / Root Grubs',
  'Other / Unidentified Pest',
];

const PestDiseasePage = () => {
  const [reports, setReports] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [preliminaryAdvice, setPreliminaryAdvice] = useState(null);

  const [formData, setFormData] = useState({
    cropId: '',
    cropName: 'Sharbati Wheat',
    pestOrDiseaseName: 'Yellow Rust (Puccinia striiformis)',
    symptoms: 'Small chlorotic streaks and yellow powdery pustules arranged in linear stripes on leaves.',
    severity: 'Medium',
    observationDate: new Date().toISOString().split('T')[0],
    treatment: 'Foliar spray of Tilt 25% EC (Propiconazole)',
    imageUrl: '',
  });

  const [treatmentForm, setTreatmentForm] = useState({
    treatment: '',
    notes: '',
    status: 'Under Control',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reportsRes, cropsRes] = await Promise.all([api.get('/pest'), api.get('/crops')]);
      setReports(reportsRes.data.reports || []);
      setCrops(cropsRes.data.crops || []);
      if (cropsRes.data.crops?.length > 0 && !formData.cropId) {
        setFormData((prev) => ({
          ...prev,
          cropId: cropsRes.data.crops[0]._id,
          cropName: cropsRes.data.crops[0].cropName,
        }));
      }
    } catch (err) {
      console.error('[Pest] Error loading pest data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSymptomCheck = async (crop, symptoms, pest) => {
    try {
      const res = await api.post('/pest/diagnose', {
        cropName: crop,
        symptoms,
        observedPest: pest,
      });
      setPreliminaryAdvice(res.data.data);
    } catch (err) {
      console.error('[Pest] Diagnosis check failed:', err);
    }
  };

  const handleOpenAddModal = () => {
    setIsModalOpen(true);
    handleSymptomCheck(formData.cropName, formData.symptoms, formData.pestOrDiseaseName);
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/pest', formData);
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('[Pest] Error saving pest observation:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTreatment = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;
    setSubmitting(true);
    try {
      await api.put(`/pest/${selectedReport._id}/treatment`, treatmentForm);
      setIsTreatmentModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('[Pest] Error logging treatment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading pest surveillance monitoring records..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
        <div>
          <span className="text-xs font-bold text-rose-800 bg-rose-100 px-3 py-1 rounded-full uppercase">
            Surveillance & Early Alert System
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
            Pest & Crop Disease Monitoring Center
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Log observed crop abnormalities, receive preliminary scientific guidance, and record treatment applications.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-sm shadow-md shadow-rose-700/20 transition-all flex items-center justify-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          Log Pest Observation
        </button>
      </div>

      {/* Reports Grid */}
      {reports.length === 0 ? (
        <EmptyState
          icon={Bug}
          title="No pest observations logged"
          description="Your farm canopy is currently clear. If you notice discoloration, leaf spots, or active pests, record an alert immediately."
          actionText="Log First Observation"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shrink-0 ${
                      report.severity === 'High'
                        ? 'bg-red-600'
                        : report.severity === 'Medium'
                        ? 'bg-amber-500'
                        : 'bg-emerald-600'
                    }`}
                  >
                    <Bug className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 leading-snug">{report.pestOrDiseaseName}</h3>
                    <p className="text-xs text-gray-500">
                      Crop: <strong className="text-emerald-800">{report.cropName}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      report.severity === 'High'
                        ? 'bg-red-100 text-red-800'
                        : report.severity === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {report.severity} Severity
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(report.observationDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Observed Symptoms */}
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Observed Symptoms</span>
                <p className="text-gray-800 leading-relaxed">{report.symptoms}</p>
              </div>

              {/* Preliminary Scientific Guidance */}
              {report.preventionGuidance && report.preventionGuidance.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 text-xs space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-rose-900 block flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-rose-600" /> Preliminary Agronomic Guidance
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-rose-950 font-medium leading-relaxed">
                    {report.preventionGuidance.slice(0, 2).map((guideline, i) => (
                      <li key={i}>{guideline}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Treatment Applied Logs */}
              <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-700">Treatment Applications ({report.treatmentHistory?.length || 0})</span>
                  <button
                    onClick={() => {
                      setSelectedReport(report);
                      setIsTreatmentModalOpen(true);
                    }}
                    className="font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    + Record Treatment
                  </button>
                </div>

                {report.treatmentHistory?.map((t, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between text-[11px]">
                    <span className="text-gray-800 font-semibold">{t.treatment}</span>
                    <span className="text-gray-400">{new Date(t.dateApplied).toLocaleDateString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Agronomic Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Surveillance Disclosure:</strong> All recommendations generated by this module are preliminary
          diagnoses based on farmer-reported observations. If unsure about fungal spores or systemic pests, consult
          your local Krishi Vigyan Kendra plant doctor or submit an inquiry in our Expert Consultation module.
        </p>
      </div>

      {/* Log Pest Observation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Pest or Crop Disease Observation">
        <form onSubmit={handleSubmitReport} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Affected Crop</label>
              <select
                value={formData.cropName}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({ ...formData, cropName: name });
                  handleSymptomCheck(name, formData.symptoms, formData.pestOrDiseaseName);
                }}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-rose-500 outline-none bg-white"
              >
                {crops.map((c) => (
                  <option key={c._id} value={c.cropName}>
                    {c.cropName} ({c.variety})
                  </option>
                ))}
                <option value="General Crop">Other / Unlisted Crop</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Severity Level</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-rose-500 outline-none bg-white"
              >
                <option value="Low">Low (Isolated Leaves)</option>
                <option value="Medium">Medium (Moderate Patch Infestation)</option>
                <option value="High">High (Severe / Spreading Epidemic)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Observed Pest / Disease</label>
            <select
              value={formData.pestOrDiseaseName}
              onChange={(e) => {
                const pest = e.target.value;
                setFormData({ ...formData, pestOrDiseaseName: pest });
                handleSymptomCheck(formData.cropName, formData.symptoms, pest);
              }}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-rose-500 outline-none bg-white"
            >
              {COMMON_PESTS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Observed Symptoms Details</label>
            <textarea
              rows={3}
              required
              value={formData.symptoms}
              onChange={(e) => {
                const sym = e.target.value;
                setFormData({ ...formData, symptoms: sym });
                handleSymptomCheck(formData.cropName, sym, formData.pestOrDiseaseName);
              }}
              placeholder="Describe color changes, insect appearance, leaf curling, spots..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-rose-500 outline-none"
            />
          </div>

          {/* Preliminary Advice Preview */}
          {preliminaryAdvice && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-1">
              <p className="font-bold text-rose-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                Preliminary Diagnostic Protocol
              </p>
              <p className="text-rose-900">
                Possible cause: {preliminaryAdvice.possibleCauses?.slice(0, 2).join(', ')}
              </p>
              <p className="text-rose-800 text-[11px] leading-relaxed">
                Suggested Action: {preliminaryAdvice.preventionGuidance?.[0]}
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Initial Treatment Applied</label>
            <input
              type="text"
              value={formData.treatment}
              onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
              placeholder="e.g. Sprayed Neem oil 10,000 ppm / Propiconazole 25% EC"
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-rose-500 outline-none"
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
              className="px-5 py-2 text-sm font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
            >
              {submitting ? 'Saving...' : 'Record Alert'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Record Treatment Modal */}
      <Modal
        isOpen={isTreatmentModalOpen}
        onClose={() => setIsTreatmentModalOpen(false)}
        title="Record Treatment Application"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddTreatment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Treatment Description</label>
            <input
              type="text"
              required
              value={treatmentForm.treatment}
              onChange={(e) => setTreatmentForm({ ...treatmentForm, treatment: e.target.value })}
              placeholder="e.g. Applied Tilt 25% EC @ 200 ml/acre"
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Field Observation Notes</label>
            <textarea
              rows={2}
              value={treatmentForm.notes}
              onChange={(e) => setTreatmentForm({ ...treatmentForm, notes: e.target.value })}
              placeholder="e.g. Pustule development halted, leaves greening"
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Updated Status</label>
            <select
              value={treatmentForm.status}
              onChange={(e) => setTreatmentForm({ ...treatmentForm, status: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 outline-none bg-white"
            >
              <option value="Active">Active / Still Spreading</option>
              <option value="Under Control">Under Control</option>
              <option value="Resolved">Resolved / Eradicated</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsTreatmentModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              {submitting ? 'Saving...' : 'Save Treatment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PestDiseasePage;
