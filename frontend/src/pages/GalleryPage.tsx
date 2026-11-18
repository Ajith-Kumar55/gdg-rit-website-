import React, { useState, useEffect } from 'react';
import { Search, Image, Maximize2 } from 'lucide-react';
import { apiService, getAssetUrl } from '../services/api';
import type { GalleryImageItem } from '../types';
import { Lightbox } from '../components/gallery/Lightbox';

export const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await apiService.getGallery();
        setImages(data);
      } catch (err) {
        console.error("Error loading gallery:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = ['ALL', 'INAUGURATION', 'COMPETITIONS', 'ACTIVITIES', 'COMMUNITY'];

  const filteredImages = images.filter((img) => {
    const matchesCat =
      selectedCategory === 'ALL'
        ? true
        : img.category.toUpperCase().includes(selectedCategory);

    const matchesSearch =
      img.title.toLowerCase().includes(search.toLowerCase()) ||
      (img.description && img.description.toLowerCase().includes(search.toLowerCase()));

    return matchesCat && matchesSearch;
  });

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-blue-400 font-bold uppercase tracking-wider">
          <span>OUR COMMUNITY IN MOMENTS</span>
          <span>✳</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          Moments that make <span className="google-gradient-text">our community.</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
          Explore the memories, experiences, hackathons, and activities that bring GDG on Campus – RIT Hassan together.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-[#090D18] border border-white/10">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all uppercase ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat === 'ALL' ? 'All Photos' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search photographs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-20 p-8 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <Image className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No photographs found</h3>
          <p className="text-xs text-slate-400">Try selecting another category or clear your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => {
                setLightboxIndex(idx);
                setLightboxOpen(true);
              }}
              className="group relative rounded-2xl overflow-hidden bg-[#151E30] image-3d-frame cursor-pointer aspect-[4/3]"
            >
              <img
                src={getAssetUrl(img.image_url)}
                alt={img.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B14]/95 via-[#080B14]/25 to-transparent opacity-85 group-hover:opacity-100 transition-opacity" />

              {/* Hover maximize cue */}
              <div className="absolute top-3 right-3 p-2 rounded-full bg-[#151E30]/80 border border-[#00D4FF]/35 text-[#00D4FF] opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Content info */}
              <div className="absolute bottom-4 left-4 right-4 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#4285F4]/25 text-[#00D4FF] border border-[#00D4FF]/35 inline-block backdrop-blur-sm">
                  {img.category}
                </span>
                <h3 className="text-sm font-bold text-[#F5F7FF] line-clamp-1">{img.title}</h3>
                {img.description && (
                  <p className="text-[11px] text-[#A6B0C3] line-clamp-2 leading-relaxed">
                    {img.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        images={filteredImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredImages.length - 1))}
        onNext={() => setLightboxIndex((prev) => (prev < filteredImages.length - 1 ? prev + 1 : 0))}
      />
    </div>
  );
};
