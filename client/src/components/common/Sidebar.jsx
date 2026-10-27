import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Sprout,
  CloudSun,
  FlaskConical,
  Bug,
  ShoppingBag,
  Package,
  UserCheck,
  MessageSquare,
  Bell,
  User,
  Users,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';

const Sidebar = () => {
  const { user, isAdmin } = useAuth();

  const farmerLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Farms', path: '/farms', icon: Sprout },
    { name: 'Crop Management', path: '/crops', icon: Sprout },
    { name: 'Weather Forecast', path: '/weather', icon: CloudSun },
    { name: 'Soil Analysis', path: '/soil-analysis', icon: FlaskConical },
    { name: 'Pest & Disease Alerts', path: '/pest-disease', icon: Bug },
    { name: 'Agri Marketplace', path: '/marketplace', icon: ShoppingBag },
    { name: 'My Orders', path: '/orders', icon: Package },
    { name: 'Expert Advice', path: '/expert-advice', icon: UserCheck },
    { name: 'Community Forum', path: '/community', icon: MessageSquare },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Profile & Settings', path: '/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'Admin Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Marketplace Inventory', path: '/admin/products', icon: ShoppingBag },
    { name: 'Order Management', path: '/admin/orders', icon: Package },
    { name: 'Consultations', path: '/admin/consultations', icon: UserCheck },
    { name: 'Content Moderation', path: '/admin/moderation', icon: FileCheck },
    { name: 'Return to Farmer View', path: '/dashboard', icon: Sprout },
  ];

  const links = isAdmin ? adminLinks : farmerLinks;

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shrink-0 min-h-[calc(100vh-5rem)]">
      {/* User Mini Banner */}
      <div className="p-4 border-b border-gray-100 bg-emerald-50/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center uppercase shadow-xs">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-gray-900 truncate">{user?.fullName}</h4>
            <p className="text-xs text-emerald-700 capitalize flex items-center gap-1 font-medium">
              {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
              {user?.role} Portal
            </p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard' || item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30 font-semibold'
                    : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/70'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-100 text-[11px] text-gray-400">
        <p className="font-semibold text-gray-600">AgriTech System v1.0</p>
        <p>{user?.district ? `${user.district}, ${user.state}` : 'India'}</p>
      </div>
    </aside>
  );
};

export default Sidebar;
