import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlay, FiInfo, FiClock, FiStar } from 'react-icons/fi';
import { getPosterUrl } from '../../utils/image';
import { formatTime } from '../../utils/timeFomat';
import { decodeHTMLEntities } from '../../utils/textFomat';

interface MovieCardProps {
    movie: MovieItem;
    index: number;
}

const TrendingCard: React.FC<MovieCardProps> = ({ movie, index }) => {
    const rating = movie.tmdb?.vote_average || 0;
    const displayRating = rating > 0 ? rating.toFixed(1) : 'N/A';
    const rank = index + 1;

    const getRankColor = (r: number) => {
        if (r === 1) return 'text-[#FFD700]';
        if (r === 2) return 'text-[#C0C0C0]';
        if (r === 3) return 'text-[#CD7F32]';
        return 'text-[#FDE047]';
    };

    const rankStyle: React.CSSProperties = {
        textShadow: '2px 2px 0px rgba(0,0,0,0.5)',
        fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
        lineHeight: 1
    };

    return (
        <div className="group relative w-full h-full flex flex-col gap-3 bg-gray-800 pb-4 rounded-xl hover:shadow-2xl hover:shadow-black/30 transition-shadow duration-300">
            {/* 1. Card Poster với góc tam giác */}
            <Link to={`/phim/${movie.slug}`} className="relative w-full rounded-xl overflow-hidden shadow-lg transition-transform duration-300 group-hover:-translate-y-1">
                {/* Container với clip-path cho hiệu ứng tam giác */}
                <div className="relative aspect-[2/3] w-full" style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)'
                }}>
                    <img
                        src={getPosterUrl(movie.poster_url)}
                        alt={movie.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                    />

                    {/* Overlay gradient */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />

                    {/* Badges */}
                    <div className="absolute bottom-2 right-1/3 flex gap-1">
                        <span className="bg-slate-700/80 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/20">
                            {movie.quality || 'HD'}
                        </span>
                        <span className="bg-green-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/20 truncate max-w-[60px]">
                            {movie.lang || 'Vietsub'}
                        </span>
                    </div>
                </div>
            </Link>

            {/* 2. Phần Số thứ tự + Thông tin */}
            <div className="flex items-start gap-3 px-3">
                <div
                    className={`text-5xl md:text-6xl font-black italic -mt-2 ${getRankColor(rank)}`}
                    style={rankStyle}
                >
                    {rank}
                </div>

                <div className="flex-1 min-w-0 pt-1">
                    <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 group-hover:text-amber-400 transition-colors">
                        <Link to={`/phim/${movie.slug}`}>{decodeHTMLEntities(movie.name)}</Link>
                    </h3>
                    <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{decodeHTMLEntities(movie.origin_name)}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-300 font-semibold">
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>{movie.year}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>{formatTime(movie.time)}</span>
                    </div>
                </div>
            </div>

            {/* HOVER POPUP (PC ONLY) */}
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 invisible opacity-0 scale-95 group-hover:visible group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out delay-200 pointer-events-none group-hover:pointer-events-auto">
                <div className="w-[320px] bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-slate-900/5 text-slate-800">
                    <Link to={`/phim/${movie.slug}`} className="block relative aspect-video w-full overflow-hidden">
                        <img src={getPosterUrl(movie.thumb_url)} alt={movie.name} className="h-full w-full object-cover" />
                        <div className="absolute top-2 right-2">
                            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                                {movie.episode_current || 'Full'}
                            </span>
                        </div>
                    </Link>

                    <div className="p-4 flex flex-col gap-3 text-left bg-white">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{decodeHTMLEntities(movie.name)}</h3>
                            <p className="text-xs text-slate-500 line-clamp-1">{decodeHTMLEntities(movie.origin_name)}</p>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 p-2 rounded-lg">
                            <div className="flex items-center gap-1 text-amber-500"><FiStar className="fill-current" /> {displayRating}</div>
                            <span className="w-px h-3 bg-slate-300"></span>
                            <span>{movie.year}</span>
                            <span className="w-px h-3 bg-slate-300"></span>
                            <span className="flex items-center gap-1"><FiClock /> {formatTime(movie.time)}</span>
                        </div>

                        <div className="flex gap-2">
                            <Link to={`/phim/${movie.slug}`} className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2.5 rounded-lg transition-colors">
                                <FiPlay className="fill-current text-sm" /> XEM NGAY
                            </Link>
                            <Link to={`/phim/${movie.slug}`} className="p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-sky-500 transition-colors">
                                <FiInfo size={16} />
                            </Link>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                            {movie.category?.slice(0, 3).map((cat) => (
                                <span key={cat.id} className="text-[9px] font-bold uppercase text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                    {cat.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface TopTrendingSectionProps {
    movies: MovieItem[];
    loading: boolean;
}

const TopTrendingSection: React.FC<TopTrendingSectionProps> = ({ movies, loading }) => {
    const topMovies = movies.slice(0, 6);

    if (loading) return null;
    if (topMovies.length === 0) return null;

    return (
        <div className="mb-12">
            {/* Header Title */}
            <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-black uppercase tracking-wide border-l-4 border-amber-500 pl-3">
                    Top 10 phim chiếu rạp hôm nay
                </h2>

                <Link to="/chieu-rap" className="ml-auto text-sm text-amber-500 font-semibold hover:underline">
                    Xem thêm &rarr;
                </Link>
            </div>

            {/* Mobile: Horizontal Scroll | Desktop: Grid */}
            <div className="md:hidden">
                {/* Container scroll ngang cho mobile */}
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
                    {topMovies.map((movie, index) => (
                        <div key={movie._id} className="flex-shrink-0 w-[45%] snap-start">
                            <TrendingCard movie={movie} index={index} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop: Grid layout */}
            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
                {topMovies.map((movie, index) => (
                    <div key={movie._id}>
                        <TrendingCard movie={movie} index={index} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopTrendingSection;