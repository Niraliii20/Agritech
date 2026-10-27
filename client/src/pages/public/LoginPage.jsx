import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Eye, EyeOff, Lock, Mail, Sprout, ShieldCheck, ArrowRight,
  AlertCircle, KeyRound, Copy, CheckCheck, ChevronDown, ChevronUp,
  User, Clock, Shield, Code2, Leaf,
} from 'lucide-react';

// ─── Pure JS JWT decoder ──────────────────────────────────────────────────────
const decodeJWT = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const decode = (str) => JSON.parse(atob(str.replace(/-/g, '+').replace(/_/g, '/')));
    return { header: decode(parts[0]), payload: decode(parts[1]) };
  } catch { return null; }
};

// ─── JWT Info Panel (shown briefly after login) ───────────────────────────────
const JWTPanel = ({ token, user, onContinue }) => {
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const decoded = decodeJWT(token);
  const expiry   = decoded?.payload?.exp ? new Date(decoded.payload.exp * 1000) : null;
  const issuedAt = decoded?.payload?.iat ? new Date(decoded.payload.iat * 1000) : null;

  const copy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const [h, p, s] = token.split('.');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-950 via-green-900 to-teal-900">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900">JWT Access Token</h2>
            <p className="text-[11px] text-gray-500">
              Signed in as <span className="font-bold text-emerald-700">{user?.fullName}</span>
              {' '}&bull; Role: <span className={user?.role === 'admin' ? 'text-amber-600 font-bold' : 'text-emerald-700 font-bold capitalize'}>{user?.role}</span>
            </p>
          </div>
        </div>

        {/* Colour legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-semibold text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400" />Header</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-400" />Payload</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" />Signature</span>
        </div>

        {/* Token */}
        <div className="bg-gray-950 rounded-2xl p-4 relative">
          <span className="break-all font-mono text-[11px] leading-relaxed">
            <span className="text-rose-400">{h}</span>
            <span className="text-gray-500">.</span>
            <span className="text-violet-400">{p}</span>
            <span className="text-gray-500">.</span>
            <span className="text-amber-400">{s}</span>
          </span>
          <button onClick={copy} className="absolute top-3 right-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg px-2.5 py-1 flex items-center gap-1 text-[10px] font-semibold transition-colors">
            {copied ? <><CheckCheck className="w-3 h-3 text-emerald-400" />Copied!</> : <><Copy className="w-3 h-3" />Copy</>}
          </button>
        </div>

        {/* Claims grid */}
        {decoded && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-rose-50 border border-rose-100 p-3 space-y-1.5">
              <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1"><Code2 className="w-3 h-3" />Header</p>
              <div className="text-xs space-y-1 text-gray-700">
                <div className="flex justify-between"><span className="text-gray-400">alg</span><span className="font-semibold">{decoded.header.alg}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">typ</span><span className="font-semibold">{decoded.header.typ}</span></div>
              </div>
            </div>
            <div className="rounded-2xl bg-violet-50 border border-violet-100 p-3 space-y-1.5">
              <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wider flex items-center gap-1"><User className="w-3 h-3" />Payload</p>
              <div className="text-xs space-y-1 text-gray-700">
                <div className="flex justify-between"><span className="text-gray-400">role</span><span className={"font-semibold capitalize " + (decoded.payload.role === 'admin' ? 'text-amber-600' : 'text-emerald-700')}>{decoded.payload.role}</span></div>
                <div className="flex justify-between gap-1"><span className="text-gray-400 shrink-0">id</span><span className="font-semibold text-[9px] truncate">{decoded.payload.id}</span></div>
              </div>
            </div>
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-3 space-y-1">
              <p className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1"><Clock className="w-3 h-3" />Issued</p>
              <p className="text-xs font-semibold text-gray-800">{issuedAt ? issuedAt.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-3 space-y-1">
              <p className="text-[10px] font-bold text-amber-600 uppercase flex items-center gap-1"><Shield className="w-3 h-3" />Expires</p>
              <p className="text-xs font-semibold text-gray-800">{expiry ? expiry.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}</p>
            </div>
          </div>
        )}

        {/* Raw toggle */}
        <button onClick={() => setShowRaw(v => !v)} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 font-medium">
          {showRaw ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {showRaw ? 'Hide raw JSON' : 'Show raw decoded JSON'}
        </button>
        {showRaw && decoded && (
          <pre className="text-[10px] bg-gray-950 text-emerald-400 rounded-xl p-3 overflow-auto max-h-40 font-mono">
            {JSON.stringify({ header: decoded.header, payload: decoded.payload }, null, 2)}
          </pre>
        )}

        {/* Storage note */}
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-800">
          <span className="font-bold">ℹ️ How auth works:</span> Token saved in <code className="bg-emerald-100 px-1 rounded">localStorage</code> and sent automatically as <code className="bg-emerald-100 px-1 rounded">Authorization: Bearer &lt;token&gt;</code> on every API call.
        </div>

        <button onClick={onContinue} className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2">
          Go to {user?.role === 'admin' ? 'Admin Panel' : 'Dashboard'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ─── Login Page (no navbar — served inside AuthLayout) ────────────────────────
const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [jwtData, setJwtData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      setJwtData({ token: data.token, user: data.user });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate(jwtData?.user?.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
  };

  // Fill demo credentials
  const fillDemo = (type) => {
    if (type === 'farmer') { setEmail('farmer@agritech.in'); setPassword('Farmer@123'); }
    else                   { setEmail('admin@agritech.in');  setPassword('Admin@123');  }
    setError('');
  };

  // Show JWT panel after successful login
  if (jwtData) return <JWTPanel token={jwtData.token} user={jwtData.user} onContinue={handleContinue} />;

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel: branding (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-emerald-950 via-green-900 to-teal-900 text-white">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-emerald-300" />
          </div>
          <span className="text-lg font-black tracking-tight">AgriTech</span>
        </div>

        {/* Hero text */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-semibold text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Smart Farming Platform
            </div>
            <h1 className="text-4xl xl:text-5xl font-black leading-tight">
              Empower Your<br />
              <span className="text-emerald-400">Farm with AI</span><br />
              &amp; Technology
            </h1>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Real-time weather, crop lifecycle tracking, soil health reports, pest alerts, and expert consultations — all in one place.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {['🌤 Live Weather', '🌾 Crop Tracker', '🧪 Soil Health', '🐛 Pest Alerts', '👨‍🌾 Expert Chat'].map(f => (
              <span key={f} className="bg-white/10 border border-white/15 rounded-full px-3 py-1 text-xs font-medium text-white/80">{f}</span>
            ))}
          </div>
        </div>

        {/* Demo credentials card */}
        <div className="bg-white/8 border border-white/15 rounded-2xl p-5 space-y-3">
          <p className="text-xs font-bold text-white/60 uppercase tracking-wider">Demo Credentials</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-white/10 rounded-xl px-3 py-2.5">
              <div>
                <p className="text-[10px] text-white/50 font-medium">FARMER ACCOUNT</p>
                <p className="text-sm font-bold text-emerald-300">farmer@agritech.in</p>
                <p className="text-xs text-white/60 font-mono">Farmer@123</p>
              </div>
              <Sprout className="w-5 h-5 text-emerald-400 opacity-70" />
            </div>
            <div className="flex items-center justify-between bg-white/10 rounded-xl px-3 py-2.5">
              <div>
                <p className="text-[10px] text-white/50 font-medium">ADMIN ACCOUNT</p>
                <p className="text-sm font-bold text-amber-300">admin@agritech.in</p>
                <p className="text-xs text-white/60 font-mono">Admin@123</p>
              </div>
              <ShieldCheck className="w-5 h-5 text-amber-400 opacity-70" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel: login form ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-sm space-y-7">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-black text-gray-900">AgriTech</span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-500">Sign in to your AgriTech account</p>
          </div>

          {/* Mobile demo pills */}
          <div className="lg:hidden grid grid-cols-2 gap-2">
            <button onClick={() => fillDemo('farmer')} className="flex items-center gap-1.5 justify-center px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors">
              <Sprout className="w-3.5 h-3.5" /> Demo Farmer
            </button>
            <button onClick={() => fillDemo('admin')} className="flex items-center gap-1.5 justify-center px-3 py-2 text-xs font-semibold rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors">
              <ShieldCheck className="w-3.5 h-3.5" /> Demo Admin
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="farmer@agritech.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-sm shadow-md shadow-emerald-700/25 transition-all hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Authenticating...</>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Desktop quick fill (below form) */}
          <div className="hidden lg:block pt-1">
            <p className="text-[11px] text-gray-400 font-medium mb-2 uppercase tracking-wider">Quick fill demo account</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => fillDemo('farmer')} className="flex items-center gap-1.5 justify-center px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                <Sprout className="w-3.5 h-3.5" /> Demo Farmer
              </button>
              <button onClick={() => fillDemo('admin')} className="flex items-center gap-1.5 justify-center px-3 py-2 text-xs font-semibold rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors">
                <ShieldCheck className="w-3.5 h-3.5" /> Demo Admin
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500">
            New farmer?{' '}
            <Link to="/register" className="font-bold text-emerald-700 hover:text-emerald-800">Create a free account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
