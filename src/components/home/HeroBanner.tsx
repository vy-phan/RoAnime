import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlay, FiInfo, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getPosterUrl } from '../../utils/image';
import { FaStar } from 'react-icons/fa';
import { decodeHTMLEntities } from '../../utils/textFomat';


interface HeroBannerProps {
  movies: MovieItem[];
  loading?: boolean;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ movies, loading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const bannerMovies = movies.slice(0, 5);

  // Auto slide
  useEffect(() => {
    if (bannerMovies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === bannerMovies.length - 1 ? 0 : prev + 1));
    }, 6000); 
    return () => clearInterval(interval);
  }, [bannerMovies.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn chặn click lan ra link
    setCurrentIndex((prev) => (prev === 0 ? bannerMovies.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev === bannerMovies.length - 1 ? 0 : prev + 1));
  };

  if (loading || bannerMovies.length === 0) {
    return (
      <div className="w-full h-[400px] md:h-[500px] bg-slate-200 rounded-3xl animate-pulse mb-8 shadow-sm" />
    );
  }

  const movie = bannerMovies[currentIndex];

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[550px] mb-12 group overflow-hidden rounded-3xl shadow-2xl shadow-slate-900/20 bg-slate-900">
      
      {/* --- BACKGROUND LAYERS --- */}
      {bannerMovies.map((item, index) => (
        <div
          key={item._id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Ảnh nền */}
          <img
            src={getPosterUrl(item.thumb_url)}
            alt={item.name}
            className="w-full h-full object-cover object-center"
          />
          
          {/* Gradient Phủ */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          
          {/* Texture chấm bi (Mờ hơn: opacity-10) */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:24px_24px] mix-blend-overlay" />
        </div>
      ))}

      {/* --- CONTENT LAYER (LEFT SIDE) --- */}
      <div className="absolute inset-0 z-20 flex items-center px-6 md:px-12 lg:px-16 pointer-events-none">
        {/* pointer-events-auto cho nội dung để vẫn click được nút/link */}
        <div className="max-w-3xl flex flex-col gap-5 animate-in slide-in-from-left-10 fade-in duration-700 pointer-events-auto">
          
          {/* Title Section (Line clamp 3) */}
          <div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-xl uppercase line-clamp-3">
              {decodeHTMLEntities(movie.name)}
            </h2>
            <p className="text-lg md:text-xl text-amber-400 font-bold mt-2 tracking-wide line-clamp-1">
              {decodeHTMLEntities(movie.origin_name)}
            </p>
          </div>

          {/* Metadata Row (Mờ hơn) */}
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-300">
             {/* Badge IMDb Vàng */}
             <span className="flex items-center gap-1 text-white  px-2 py-0.5 rounded font-bold border border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                {movie.tmdb?.vote_average ? movie.tmdb.vote_average.toFixed(1) : '8.5'}
                <FaStar className='text-yellow-500' />
             </span>

             {/* Năm & Chất lượng (Viền mờ & Nền trong suốt hơn) */}
             <span className="border border-white/20 px-2.5 py-0.5 rounded text-slate-300 bg-white/5 backdrop-blur-sm">
                {movie.year}
             </span>
             <span className="border border-white/20 px-2.5 py-0.5 rounded text-slate-300 bg-white/5 backdrop-blur-sm uppercase">
                {movie.quality || 'FHD'}
             </span>
             
             {/* Số tập */}
             {movie.episode_current && (
                <span className="border border-white/20 px-2.5 py-0.5 rounded text-slate-300 bg-white/5 backdrop-blur-sm">
                    {movie.episode_current}
                </span>
             )}
          </div>

          {/* Genres Row */}
          <div className="flex flex-wrap gap-2 opacity-90">
             {movie.category?.slice(0, 5).map((cat, idx) => (
                 <span key={idx} className="text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer">
                    {cat.name} {idx < (movie.category?.length || 0) - 1 && idx < 4 && "•"}
                 </span>
             ))}
             {(!movie.category || movie.category.length === 0) && (
                 <span className="text-xs text-slate-400">Hành động • Phiêu lưu • Hoạt hình</span>
             )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-4">
            <Link 
              to={`/phim/${movie.slug}`}
              className="group/play flex items-center justify-center w-16 h-16 rounded-full bg-amber-400 hover:bg-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all hover:scale-110 active:scale-95"
            >
              <FiPlay className="fill-current text-slate-900 text-2xl ml-1 group-hover/play:scale-110 transition-transform" />
            </Link>

            <Link 
              to={`/phim/${movie.slug}`}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/10 text-slate-300 hover:bg-white/20 hover:text-white hover:border-white/30 transition-all backdrop-blur-sm"
            >
               <FiInfo size={20} />
            </Link>
          </div>

        </div>
      </div>

      {/* --- NAVIGATION ARROWS (Ẩn - Hiện khi Hover) --- */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 hover:bg-amber-400 hover:text-black border border-white/10 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 -translate-x-4 group-hover:translate-x-0"
      >
        <FiChevronLeft size={24} />
      </button>

      <button 
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 hover:bg-amber-400 hover:text-black border border-white/10 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 translate-x-4 group-hover:translate-x-0"
      >
        <FiChevronRight size={24} />
      </button>

      {/* --- DOTS INDICATOR --- */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {bannerMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-500 rounded-full h-1.5 ${
              index === currentIndex 
                ? 'w-8 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' 
                : 'w-1.5 bg-slate-600 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>

    </div>
  );
};

export default HeroBanner;