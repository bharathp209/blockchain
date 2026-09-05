import React, { useState } from 'react';
import { api } from '../services/api';
import {
  FilePlus,
  Upload,
  Blocks,
  CheckCircle2,
  Hash,
  ArrowRight,
  Sparkles,
  FileCheck,
  ShieldCheck
} from 'lucide-react';

export default function AddRecordPage({ onNavigate, onRecordCreated }) {
  const [surveyNumber, setSurveyNumber] = useState('TN-ERD-1024');
  const [ownerName, setOwnerName] = useState('Ravi Kumar');
  const [village, setVillage] = useState('Perundurai');
  const [district, setDistrict] = useState('Erode');
  const [state, setState] = useState('Tamil Nadu');
  const [landArea, setLandArea] = useState('2.50 Acres');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const handleFillDemo = () => {
    setSurveyNumber('TN-ERD-1024');
    setOwnerName('Ravi Kumar');
    setVillage('Perundurai');
    setDistrict('Erode');
    setState('Tamil Nadu');
    setLandArea('2.50 Acres');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('survey_number', surveyNumber);
      formData.append('owner_name', ownerName);
      formData.append('village', village);
      formData.append('district', district);
      formData.append('state', state);
      formData.append('land_area', landArea);
      if (file) {
        formData.append('document', file);
      }

      const res = await api.createLandRecord(formData);
      if (res.success) {
        setSuccessData(res);
        if (onRecordCreated) onRecordCreated(res);
      }
    } catch (err) {
      setError(err.message || 'Failed to register land record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FilePlus className="w-5 h-5 text-cyan-400" />
            <span>Register New Land Record</span>
          </h1>
          <p className="text-xs text-slate-400">
            Cryptographically anchors land title and deed hash to the immutable blockchain
          </p>
        </div>

        <button
          type="button"
          onClick={handleFillDemo}
          className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition flex items-center gap-1.5"
          title="Autofill sample record values (TN-ERD-1024)"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Autofill Demo Record (TN-ERD-1024)</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Form Card */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Survey Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={surveyNumber}
                onChange={(e) => setSurveyNumber(e.target.value.toUpperCase())}
                required
                placeholder="e.g. TN-ERD-1024"
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Owner Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
                placeholder="e.g. Ravi Kumar"
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Village / Taluk <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                required
                placeholder="e.g. Perundurai"
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                District <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
                placeholder="e.g. Erode"
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Land Area / Dimensions <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={landArea}
                onChange={(e) => setLandArea(e.target.value)}
                required
                placeholder="e.g. 2.50 Acres"
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 font-medium"
              />
            </div>
          </div>

          {/* Document Upload Box */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Official Title Deed Document (Generates SHA-256 File Hash)
            </label>
            <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-xl p-6 text-center transition bg-slate-950/40">
              <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <input
                type="file"
                id="docUpload"
                onChange={(e) => setFile(e.target.files[0] || null)}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
              />
              <label
                htmlFor="docUpload"
                className="cursor-pointer text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
              >
                {file ? file.name : 'Click to select sample title deed / document (PDF, TXT)'}
              </label>
              <p className="text-[11px] text-slate-500 mt-1">
                {file 
                  ? `Selected: ${(file.size / 1024).toFixed(1)} KB • Hash will be generated automatically` 
                  : 'If no file is selected, a verified mock digital deed hash will be calculated.'}
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <span className="text-[11px] text-slate-500">
              Anchors to SHA-256 Blockchain Ledger
            </span>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs tracking-wider uppercase transition shadow-[0_0_20px_rgba(0,212,255,0.3)] flex items-center gap-2"
            >
              <Blocks className="w-4 h-4" />
              {loading ? 'Mining Block...' : 'REGISTER LAND'}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal / Banner after registration */}
      {successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl border border-emerald-500/50 bg-[#0a0f1d] shadow-[0_0_50px_rgba(16,185,129,0.25)] p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-emerald-300">
                  Land Record Registered & Anchored!
                </h3>
                <p className="text-xs text-slate-300">
                  Transaction successfully mined into new Block #{successData.blockchain?.block_index}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Transaction ID:</span>
                <p className="font-mono text-cyan-300 font-bold">{successData.blockchain?.transaction_id}</p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Record SHA-256 Hash:</span>
                <p className="font-mono text-emerald-300 text-[11px] break-all bg-black/40 p-1.5 rounded mt-0.5">
                  {successData.blockchain?.record_hash}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Mined Block Hash:</span>
                <p className="font-mono text-slate-300 text-[11px] break-all bg-black/40 p-1.5 rounded mt-0.5">
                  {successData.blockchain?.block_hash}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Document Integrity Hash:</span>
                <p className="font-mono text-slate-400 text-[11px] break-all bg-black/40 p-1.5 rounded mt-0.5">
                  {successData.blockchain?.document_hash}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setSuccessData(null);
                  onNavigate('records');
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                View Records
              </button>

              <button
                onClick={() => {
                  setSuccessData(null);
                  onNavigate('blockchain');
                }}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Blocks className="w-3.5 h-3.5" />
                <span>Open in Blockchain Explorer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
