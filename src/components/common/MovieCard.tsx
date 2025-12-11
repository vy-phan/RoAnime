import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlay, FiInfo, FiClock, FiStar } from 'react-icons/fi';
import { getPosterUrl } from '../../utils/image';
import { formatTime } from '../../utils/timeFomat';

interface MovieCardProps {
    movie: MovieItem;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    const rating = movie.tmdb?.vote_average || 0;
    const displayRating = rating > 0 ? rating.toFixed(1) : 'N/A';

    return (
        <div className="group relative w-full h-full">
            <Link
                to={`/phim/${movie.slug}`}
                className="flex flex-col h-full gap-3 cursor-pointer transition-all duration-300 active:scale-[0.98]"
            >
                <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-slate-200 shadow-lg shadow-sky-500/10 group-hover:shadow-sky-500/30 transition-shadow duration-500">
                    <img
                        src={getPosterUrl(movie.poster_url)}
                        alt={movie.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                    />

                    {/* Lớp phủ mờ nhẹ ở đáy ảnh cho Mobile */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent md:hidden" />

                    {/* Badge Tập hiện tại */}
                    {movie.episode_current && (
                        <div className="absolute top-2 left-2">
                            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                {movie.episode_current}
                            </span>
                        </div>
                    )}
                </div>

                {/* Thông tin tĩnh */}
                <div className="px-1 space-y-1">
                    <h3 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-sky-600 transition-colors">
                        {movie.name}
                    </h3>
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-slate-500 line-clamp-1 max-w-[70%]">{movie.origin_name}</p>
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                            {movie.year}
                        </span>
                    </div>
                </div>
            </Link>

            {/* HOVER CARD (POPUP - PC ONLY) */}
            {/* HOVER CARD (POPUP - PC ONLY) */}
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 invisible opacity-0 scale-95 group-hover:visible group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out delay-200">

                {/* Container */}
                <div className="w-[400px] bg-gradient-to-br from-white via-white to-slate-50 rounded-3xl shadow-[0_30px_80px_-15px_rgba(0,0,0,0.35)] overflow-hidden ring-1 ring-slate-900/5">

                    {/* A. Ảnh Thumb - Không có overlay che */}
                    <Link to={`/phim/${movie.slug}`} className="block relative aspect-video w-full overflow-hidden group/image">
                        <img
                            src={getPosterUrl(movie.thumb_url)}
                            alt={movie.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover/image:scale-105"
                        />

                        {/* Badge nổi bật trên ảnh */}
                        {movie.episode_current && (
                            <div className="absolute top-3 right-3">
                                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                                    {movie.episode_current}
                                </span>
                            </div>
                        )}

                        {/* Gradient fade nhẹ chỉ ở đáy ảnh */}
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
                    </Link>

                    {/* B. Nội dung - Nằm hoàn toàn dưới ảnh */}
                    <div className="px-6 pt-4 pb-6 flex flex-col gap-3.5 text-left bg-white">

                        {/* Tiêu đề */}
                        <div className="space-y-1.5">
                            <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 leading-tight line-clamp-2">
                                {movie.name}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium line-clamp-1 tracking-wide">
                                {movie.origin_name}
                            </p>
                        </div>

                        {/* Stats bar */}
                        <div className="flex items-center gap-2.5 py-2.5 px-3 bg-gradient-to-r from-slate-50 to-transparent rounded-xl border border-slate-100/50">
                            {/* Rating */}
                            <div className="flex items-center gap-1.5 bg-gradient-to-br from-amber-400 to-yellow-500 text-white px-2.5 py-1 rounded-lg shadow-sm">
                                <FiStar className="fill-current text-xs" />
                                <span className="text-xs font-black">{displayRating}</span>
                            </div>

                            <div className="w-px h-4 bg-slate-200"></div>

                            {/* Year */}
                            <div className="bg-gradient-to-br from-slate-800 to-slate-700 text-white px-2.5 py-1 rounded-lg shadow-sm">
                                <span className="text-xs font-bold">{movie.year}</span>
                            </div>

                            <div className="w-px h-4 bg-slate-200"></div>

                            {/* Duration */}
                            <div className="flex items-center gap-1.5 text-slate-600">
                                <FiClock className="text-xs" />
                                <span className="text-xs font-semibold">{formatTime(movie.time)}</span>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2.5">
                            <Link
                                to={`/phim/${movie.slug}`}
                                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:via-orange-500 hover:to-orange-600 text-white text-sm font-black py-3 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5 active:scale-95"
                            >
                                <FiPlay className="fill-current text-base" />
                                <span className="tracking-wide">XEM NGAY</span>
                            </Link>

                            <Link
                                to={`/phim/${movie.slug}`}
                                className="p-3 rounded-xl bg-white border-2 border-slate-200 text-slate-600 hover:border-sky-400 hover:text-sky-500 hover:bg-sky-50 hover:shadow-lg hover:shadow-sky-500/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                                title="Chi tiết phim"
                            >
                                <FiInfo size={20} strokeWidth={2.5} />
                            </Link>
                        </div>

                        {/* Genre tags */}
                        <div className="flex flex-wrap justify-start gap-2 pt-3 border-t border-slate-200/60">
                            {movie.category?.slice(0, 3).map((cat) => (
                                <span
                                    key={cat.id}
                                    className="text-[10px] font-bold uppercase tracking-widest text-slate-600 bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-full hover:bg-gradient-to-br hover:from-sky-50 hover:to-sky-100 hover:text-sky-700 hover:border-sky-300 transition-all duration-200 cursor-default shadow-sm"
                                >
                                    {cat.name}
                                </span>
                            ))}
                            {(!movie.category || movie.category.length === 0) && (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                                    ANIME
                                </span>
                            )}
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default MovieCard;