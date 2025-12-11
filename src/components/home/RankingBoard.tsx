import React from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiStar, FiPlay } from 'react-icons/fi';
import { getPosterUrl } from '../../utils/image';

interface MovieItem {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  thumb_url: string;
  poster_url: string;
  year: number;
  tmdb?: {
      vote_average: number;
      vote_count: number;
  };
  episode_current?: string;
}

interface RankingBoardProps {
  movies: MovieItem[];
  loading?: boolean;
}

const RankingBoard: React.FC<RankingBoardProps> = ({ movies, loading }) => {
  
  // Hàm tạo style số thứ tự - CẢI TIẾN để dễ nhìn hơn
  const getRankStyle = (index: number) => {
    const baseStyle = "text-5xl font-black italic absolute -top-1 -left-2 leading-none z-10";
    
    // Màu đậm hơn, có bóng rõ ràng
    if (index === 0) return `${baseStyle} text-yellow-500 drop-shadow-[0_2px_8px_rgba(234,179,8,0.6)]`; 
    if (index === 1) return `${baseStyle} text-slate-400 drop-shadow-[0_2px_8px_rgba(148,163,184,0.6)]`;
    if (index === 2) return `${baseStyle} text-orange-500 drop-shadow-[0_2px_8px_rgba(249,115,22,0.6)]`;
    return `${baseStyle} text-slate-600 drop-shadow-[0_2px_6px_rgba(71,85,105,0.4)]`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 sticky top-24 overflow-hidden">
      
      {/* Background Pattern nhẹ */}
      <div className="absolute top-0 right-0 w-40 h-40 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-500 to-transparent" />
      </div>

      {/* Header */}
      <div className="relative flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-100">
        <div className="p-2.5 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/30">
            <FiTrendingUp className="text-xl" strokeWidth={2.5} />
        </div>
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
          Top 10 phim {new Date().getFullYear()}
        </h2>
      </div>

      {/* Loading State */}
      {loading ? (
          <div className="space-y-5">
              {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-4 animate-pulse">
                      <div className="w-16 h-24 bg-slate-200 rounded-xl"></div>
                      <div className="flex-1 space-y-3 py-2">
                          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                  </div>
              ))}
          </div>
      ) : (
        /* List Ranking */
        <div className="flex flex-col gap-5">
            {movies.map((movie, index) => (
            <Link 
                key={movie._id} 
                to={`/phim/${movie.slug}`}
                className="group relative flex items-center gap-4 p-3 -mx-3 rounded-xl hover:bg-sky-50/50 transition-all duration-300 hover:shadow-md hover:shadow-sky-100"
            >
                {/* 1. Số Thứ Tự - RÕ RÀNG HƠN */}
                <div className="relative w-12 flex-shrink-0">
                    <span 
                        className={getRankStyle(index)}
                        style={{ 
                            WebkitTextStroke: '2px white', // Viền trắng đậm để tách nền
                        }}
                    >
                        {index + 1}
                    </span>
                </div>

                {/* 2. Ảnh Poster */}
                <div className="relative w-16 h-24 flex-shrink-0 rounded-xl overflow-hidden shadow-md group-hover:shadow-xl group-hover:shadow-sky-200/60 ring-2 ring-slate-200 group-hover:ring-sky-400 transition-all duration-300">
                    <img 
                        src={getPosterUrl(movie.poster_url)} 
                        alt={movie.name} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Overlay hover với play icon */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                        <FiPlay className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-2xl fill-current drop-shadow-lg" />
                    </div>
                </div>

                {/* 3. Thông tin */}
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-sky-600 transition-colors">
                        {movie.name}
                    </h3>
                    
                    {/* Metadata: Rating + Tập */}
                    <div className="flex items-center flex-wrap gap-2">
                        {movie.tmdb?.vote_average ? (
                            <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg shadow-sm">
                                <FiStar className="text-amber-500 fill-current text-xs" /> 
                                {movie.tmdb.vote_average.toFixed(1)}
                            </span>
                        ) : (
                            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">N/A</span>
                        )}

                        <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                            {movie.episode_current || '??'}
                        </span>
                    </div>
                    
                    <p className="text-[11px] text-slate-500 line-clamp-1 font-medium">{movie.origin_name}</p>
                </div>

                {/* Hover indicator arrow */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sky-500 pr-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </Link>
            ))}

            {movies.length === 0 && (
                <div className="text-center text-sm text-slate-500 font-medium py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    Chưa có dữ liệu xếp hạng
                </div>
            )}
        </div>
      )}

    </div>
  );
};

export default RankingBoard;