import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllHistory, removeHistoryItem, clearAllHistory, type HistoryItem, type HistoryList } from '../utils/history';
import { getPosterUrl } from '../utils/image';
import { 
    FiClock, FiTrash2, FiPlay, 
    FiCalendar, FiEyeOff, FiFilm, FiX 
} from 'react-icons/fi';

const HistoryPage: React.FC = () => {
    const [historyList, setHistoryList] = useState<HistoryItem[]>([]);

    useEffect(() => {
        const data = getAllHistory();
        setHistoryList(data);
        window.scrollTo(0, 0);
    }, []);

    const handleRemove = (e: React.MouseEvent, slug: string) => {
        e.preventDefault();
        e.stopPropagation();
        // Không dùng window.confirm cho trải nghiệm mượt mà hơn, hoặc dùng custom modal
        // Ở đây mình xóa luôn cho nhanh, nếu muốn chắc chắn thì giữ confirm
        if (window.confirm('Xóa phim này khỏi lịch sử?')) {
            const newList = removeHistoryItem(slug);
            if (newList) setHistoryList(newList as HistoryList[]);
        }
    };

    const handleClearAll = () => {
        if (window.confirm('Xóa toàn bộ lịch sử?')) {
            clearAllHistory();
            setHistoryList([]);
        }
    };

    const formatTime = (timestamp: number) => {
        // Rút gọn thời gian hiển thị cho đỡ chật
        const date = new Date(timestamp);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800  font-sans">
            <div className="container mx-auto px-2 md:px-4 pt-20 md:pt-28">
                
                {/* HEADER */}
                <div className="flex flex-row items-center justify-between gap-4 mb-6 px-2">
                    <div>
                        <h1 className="text-xl md:text-3xl font-black text-slate-900 flex items-center gap-2">
                            <span className="p-2 bg-amber-400 rounded-lg text-white shadow-lg shadow-amber-400/30">
                                <FiClock />
                            </span>
                            Lịch Sử Xem
                        </h1>
                    </div>

                    {historyList.length > 0 && (
                        <button 
                            onClick={handleClearAll}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-red-500 border border-red-100 rounded-full hover:bg-red-50 hover:border-red-200 font-bold text-xs md:text-sm transition-all shadow-sm active:scale-95"
                        >
                            <FiTrash2 /> <span className="hidden md:inline">Xóa tất cả</span>
                        </button>
                    )}
                </div>

                {/* CONTENT */}
                {historyList.length > 0 ? (
                    // GRID: Mobile 2 cột, Tablet 3-4 cột, PC 5 cột -> Card sẽ ốm và gọn
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                        {historyList.map((item) => (
                            <div 
                                key={item.movieSlug} 
                                className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col"
                            >
                                {/* 1. IMAGE AREA */}
                                <Link to={`/phim/${item.movieSlug}`} className="relative aspect-video overflow-hidden block bg-slate-200">
                                    <img 
                                        src={getPosterUrl(item.thumbUrl)} 
                                        alt={item.movieName}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    
                                    {/* Overlay Gradient tối dần ở dưới để chữ dễ đọc nếu muốn de đè */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-50" />

                                    {/* Nút Play xuất hiện khi hover (PC) hoặc luôn hiện nhỏ (Mobile) */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg text-amber-500 pl-1">
                                            <FiPlay className="text-xl md:text-2xl fill-current" />
                                        </div>
                                    </div>

                                    {/* Nút Xóa (Floating top-right) - Tiết kiệm diện tích bên dưới */}
                                    <button
                                        onClick={(e) => handleRemove(e, item.movieSlug)}
                                        className="absolute top-2 right-2 p-1.5 bg-black/40 hover:bg-red-500 backdrop-blur-md text-white rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                                        title="Xóa"
                                    >
                                        <FiX className="text-xs md:text-sm" />
                                    </button>

                                    {/* Badge số tập đã xem (Góc dưới trái) */}
                                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur rounded text-[10px] font-bold text-white border border-white/10">
                                        {item.watchedEpisodes?.length || 0} tập đã xem
                                    </div>
                                </Link>

                                {/* 2. INFO AREA (Compact) */}
                                <div className="p-3 flex flex-col flex-1">
                                    {/* Tên phim */}
                                    <h3 className="text-sm md:text-base font-bold text-slate-800 line-clamp-1 mb-1 group-hover:text-amber-500 transition-colors" title={item.movieName}>
                                        <Link to={`/phim/${item.movieSlug}`}>
                                            {item.movieName}
                                        </Link>
                                    </h3>

                                    {/* Ngày cập nhật */}
                                    <div className="flex items-center gap-1 text-[10px] md:text-xs text-slate-400 mb-3">
                                        <FiCalendar /> <span>{formatTime(item.updatedAt)}</span>
                                    </div>

                                    {/* Phần tập đang xem dở (Nút to rõ) */}
                                    <div className="mt-auto">
                                        <Link 
                                            to={`/phim/${item.movieSlug}/${item.lastEpisode?.slug}`}
                                            className="block w-full bg-slate-50 hover:bg-amber-400 border border-slate-200 hover:border-amber-400 group/btn rounded-lg p-2 transition-all"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase group-hover/btn:text-amber-100">Xem tiếp</span>
                                                    <span className="text-xs font-bold text-slate-700 truncate max-w-[100px] md:max-w-[140px] group-hover/btn:text-white">
                                                        {item.lastEpisode?.name || 'Tập ?'}
                                                    </span>
                                                </div>
                                                <FiPlay className="text-slate-400 group-hover/btn:text-white text-lg" />
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // EMPTY STATE (Giữ nguyên nhưng style lại chút cho gọn)
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 mx-4">
                        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                            <FiEyeOff className="text-3xl" />
                        </div>
                        <p className="text-slate-500 mb-6 font-medium">Bạn chưa xem phim nào cả.</p>
                        <Link 
                            to="/" 
                            className="flex items-center gap-2 bg-amber-400 text-slate-900 font-bold px-6 py-2 rounded-full shadow-lg shadow-amber-400/20 hover:scale-105 transition-transform text-sm"
                        >
                            <FiFilm /> Tìm phim ngay
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;