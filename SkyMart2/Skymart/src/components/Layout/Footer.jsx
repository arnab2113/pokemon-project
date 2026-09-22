import React from 'react';
import { Link } from 'react-router-dom';
import { IoLeaf, IoTime, IoShieldCheckmark, IoCard } from 'react-icons/io5';
import { APP_NAME, DEFAULT_CATEGORIES } from '../../utils/constants';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 lg:pb-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Propositions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-400 text-2xl">
              <IoTime />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Superfast 10 Mins</h4>
              <p className="text-xs text-slate-400">Delivered hot & fresh to your door</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-400 text-2xl">
              <IoLeaf />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Organic</h4>
              <p className="text-xs text-slate-400">Directly from certified farms</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-400 text-2xl">
              <IoShieldCheckmark />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Safe & Hygiene</h4>
              <p className="text-xs text-slate-400">Triple sanitized packaging</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-400 text-2xl">
              <IoCard />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Best Prices & Offers</h4>
              <p className="text-xs text-slate-400">Cheaper than local market</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12">
          
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-black text-xl">
                S
              </div>
              <span className="text-xl font-black text-white">{APP_NAME}</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
              India's fastest grocery delivery store. Order fresh vegetables, fruits, dairy, snacks, and daily household essentials online.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">Download App:</span>
              <div className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-white cursor-pointer hover:bg-slate-700 transition-colors">
                 App Store
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-white cursor-pointer hover:bg-slate-700 transition-colors">
                ▶ Play Store
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase text-white tracking-wider mb-4">Top Categories</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {DEFAULT_CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.slug}`} className="hover:text-brand-400 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase text-white tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/" className="hover:text-brand-400">Home</Link></li>
              <li><Link to="/cart" className="hover:text-brand-400">View Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-brand-400">My Wishlist</Link></li>
              <li><Link to="/orders" className="hover:text-brand-400">Track Orders</Link></li>
              <li><Link to="/profile" className="hover:text-brand-400">Account Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase text-white tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span>Email: support@skymart.com</span></li>
              <li><span>Toll-Free: 1800-SKY-MART</span></li>
              <li><span>Operating Hours: 6 AM - 11 PM</span></li>
              <li className="pt-2 text-emerald-400 font-semibold">📍 10 Mins instant radius</li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 {APP_NAME} Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Refund Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
