import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { useProducts } from '../../hooks/useProducts';
import ProductGrid from '../../components/Product/ProductGrid';
import Button from '../../components/UI/Button';
import { DEFAULT_OFFERS } from '../../utils/constants';

const HERO_SLIDES = [
  {
    id: 1,
    title: 'Fresh Farm Organic Vegetables & Fruits',
    subtitle: 'Handpicked daily directly from local farmers with 10-minute delivery guarantee.',
    tag: '⚡ 10 MIN DELIVERY',
    cta: 'Shop Fresh Now',
    link: '/category/vegetables',
    bgGradient: 'from-emerald-600 to-teal-800',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 2,
    title: 'Dairy, Milk, Eggs & Daily Essentials',
    subtitle: 'Start your morning with pure fresh milk, farm brown eggs, and artisanal butter.',
    tag: '🥛 MORNING SPECIAL',
    cta: 'Explore Dairy',
    link: '/category/dairy-eggs',
    bgGradient: 'from-amber-600 to-orange-700',
    image: 'https://images.unsplash.com/photo-1528750997573-59b89d66f4f7?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 3,
    title: 'Instant Munchies, Beverages & Snacks',
    subtitle: 'Craving midnight snacks? Get quick 2-min noodles, chips, & juices delivered fast.',
    tag: '🔥 UP TO 30% OFF',
    cta: 'Grab Snacks',
    link: '/category/bakery-snacks',
    bgGradient: 'from-purple-600 to-indigo-800',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800',
  },
];

export const HomePage = () => {
  const { featuredProducts, trendingProducts, categories } = useProducts();

  return (
    <div className="flex flex-col gap-12">
      
      {/* Hero Banner Carousel */}
      <section className="w-full rounded-3xl overflow-hidden shadow-2xl">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="w-full h-[360px] md:h-[420px]"
        >
          {HERO_SLIDES.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className={`relative w-full h-full bg-gradient-to-r ${slide.bgGradient} flex items-center px-6 md:px-16 text-white overflow-hidden`}>
                <div className="relative z-10 max-w-xl flex flex-col items-start gap-3">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold tracking-wider uppercase">
                    {slide.tag}
                  </span>
                  <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xs md:text-sm text-slate-100 opacity-90 line-clamp-2">
                    {slide.subtitle}
                  </p>
                  <Link to={slide.link} className="mt-2">
                    <Button variant="secondary" size="lg" className="shadow-lg">
                      {slide.cta}
                    </Button>
                  </Link>
                </div>
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute right-0 top-0 bottom-0 h-full w-1/2 object-cover opacity-40 md:opacity-80 mask-radial"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Category Icons Grid */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🛒</span> Shop by Category
          </h2>
          <Link to="/category/all" className="text-xs font-bold text-brand-500 hover:underline">
            View All Categories →
          </Link>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/category/${cat.slug}`}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-card rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-2 border border-slate-100 dark:border-slate-800 hover:border-brand-500 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl">
                  {cat.icon}
                </div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                  {cat.name}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Deals */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🔥</span> Trending Grocery Deals
            </h2>
            <p className="text-xs text-slate-400">Best-selling everyday kitchen items in your neighborhood</p>
          </div>
          <Link to="/category/all" className="text-xs font-bold text-brand-500 hover:underline">
            See All →
          </Link>
        </div>
        <ProductGrid products={trendingProducts} />
      </section>

      {/* Offer Coupons Carousel Banner */}
      <section className="w-full glass-card rounded-3xl p-6 border border-brand-500/20 bg-gradient-to-br from-brand-50/50 to-emerald-100/30 dark:from-brand-950/30 dark:to-slate-900">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest">
              EXCLUSIVE COUPOFFERS
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Save Big on Your Daily Basket!
            </h3>
            <p className="text-xs text-slate-500 max-w-md">
              Apply code <code className="font-extrabold text-brand-600">FRESH50</code> at checkout to get 15% instant discount.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {DEFAULT_OFFERS.slice(0, 2).map((offer, i) => (
              <div key={i} className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-1">
                <span className="text-xs font-black text-emerald-600">{offer.code}</span>
                <span className="text-[10px] text-slate-500">{offer.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🌟</span> Handpicked Farm Organic
            </h2>
            <p className="text-xs text-slate-400">Pesticide-free certified veggies & fruits</p>
          </div>
          <Link to="/category/all" className="text-xs font-bold text-brand-500 hover:underline">
            Explore All →
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>

    </div>
  );
};

export default HomePage;
