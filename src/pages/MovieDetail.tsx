import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import movieApi from '../api/movieApi';
import Loading from '../components/common/Loading';
import { getPosterUrl } from '../utils/image';
import { getYoutubeId } from '../utils/video';
import {
    FiPlay,
    FiLayers, FiYoutube, FiImage,
    FiUser, FiMapPin, FiGrid, FiAlignLeft,
    FiFilm,
    FiTv,
    FiChevronDown,
    FiCheck,
    FiShare2,
    FiArrowUp,
    FiArrowDown
} from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { addToHistory, getMovieHistory } from '../utils/history';
import { decodeHTMLEntities } from '../utils/textFomat';


const MovieDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<'episodes' | 'trailer' | 'photos'>('episodes');
    const [isShowInfo, setIsShowInfo] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [sortDesc, setSortDesc] = useState(false);
    const [watchedEpisodes, setWatchedEpisodes] = useState<string[]>([]);
    const [lastWatchedEpisode, setLastWatchedEpisode] = useState<any>(null);

    const [currentServerIndex, setCurrentServerIndex] = useState<number>(0);

    useEffect(() => {
        const fetchMovieDetail = async () => {
            if (!slug) return;
            try {
                setLoading(true);
                // Gọi API
                const response = await movieApi.getMovieDetail(slug);

                if (response.status) {
                    const movieData = {
                        ...response.movie,
                        episodes: response.episodes || []
                    };
                    setMovie(movieData);
                    const history = getMovieHistory(movieData.slug);
                    if (history) {
                        setWatchedEpisodes(history.watchedEpisodes); // Cập nhật danh sách các tập đã xem (đổi màu)

                        // Tìm lại object tập phim dựa trên slug đã lưu trong history
                        if (history.lastEpisode && movieData.episodes[0]?.server_data) {
                            const lastEp = movieData.episodes[0].server_data.find(
                                (e: any) => e.slug === history.lastEpisode.slug
                            );
                            setLastWatchedEpisode(lastEp); // Lưu tập xem dở để nút "Xem Ngay" dùng
                        }
                    }
                }
            } catch (error) {
                console.error("Lỗi tải chi tiết phim:", error);
            } finally {
                setLoading(false);
                window.scrollTo(0, 0);
            }
        };

        fetchMovieDetail();
    }, [slug]);

    // NEW: Hàm xử lý khi click vào tập phim hoặc nút xem ngay
    const handleWatchMovie = (episode: any) => {
        if (!movie) return;

        // 1. Lưu vào local storage
        addToHistory(movie, episode);

        // 2. Cập nhật state UI ngay lập tức để người dùng thấy tập đó đã đổi màu
        setWatchedEpisodes(prev => {
            if (prev.includes(episode.slug)) return prev;
            return [...prev, episode.slug];
        });
    };

    const handleCopyLink = () => {
        // Copy link hiện tại vào bộ nhớ tạm
        navigator.clipboard.writeText(window.location.href);

        // Hiển thị trạng thái "Đã copy"
        setIsCopied(true);

        // Sau 2 giây tự động quay lại trạng thái cũ
        setTimeout(() => setIsCopied(false), 2000);
    };



    if (loading) return <Loading message="Đang tải thông tin phim..." className="h-screen" />;
    if (!movie) return <div className="text-center py-20 text-slate-600">Không tìm thấy phim.</div>;

    const availableServers = movie.episodes || [];
    const currentServer = availableServers[currentServerIndex];
    const serverData = currentServer?.server_data || [];

    const youtubeId = getYoutubeId(movie.trailer_url);

    // Nếu có lịch sử (lastWatchedEpisode) thì dùng nó, nếu không thì dùng tập đầu tiên (serverData[0])
    const episodeToWatch = lastWatchedEpisode || serverData[0];

    return (
        <div className="relative min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans">

            {/* 1. HERO BACKDROP */}
            <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh]">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src={getPosterUrl(movie.thumb_url)}
                        alt={movie.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-50/20 via-transparent to-slate-50/20" />
                </div>
            </div>

            {/* 2. MAIN CONTAINER */}
            <div className="relative container mx-auto px-4 -mt-32 md:-mt-40 lg:-mt-52 z-10">

                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row gap-8 items-end mb-10">
                    <div className="flex-shrink-0 w-40 md:w-56 lg:w-64 shadow-2xl rounded-xl overflow-hidden border-4 border-white bg-white mx-auto md:mx-0">
                        <div className="relative aspect-[2/3]">
                            <img src={getPosterUrl(movie.poster_url)} alt={movie.name} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left mb-2">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight uppercase drop-shadow-sm">
                            {movie.name}
                        </h1>
                        <p className="text-lg text-slate-500 font-medium italic mt-1 mb-4">
                            {movie.origin_name}
                        </p>

                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-4">
                            {/* Loại phim */}
                            {movie.chieurap ? (
                                <span className="flex items-center gap-1.5 bg-red-50 border border-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                                    <FiFilm /> Chiếu Rạp
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                                    <FiTv /> Phim Bộ
                                </span>
                            )}

                            {/* Rating - Điểm nhấn màu vàng */}
                            <span className="flex items-center border border-amber-200 bg-amber-50 rounded-lg text-xs font-bold overflow-hidden shadow-sm">
                                <span className="px-2 py-1.5 text-amber-700 bg-amber-100/50">{movie.tmdb?.vote_average?.toFixed(1) || 'N/A'}</span>
                                <span className="px-1.5 py-1.5 bg-amber-400 text-white"><FaStar /></span>
                            </span>

                            {/* Năm & Thời lượng - Style xám nhẹ */}
                            <span className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                                {movie.year}
                            </span>
                            <span className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                                {movie.time}
                            </span>

                            {/* Tập phim */}
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm border ${movie.episode_current?.includes("Hoàn Tất") || movie.episode_current?.includes("Full")
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                : 'bg-sky-50 text-sky-600 border-sky-200'
                                }`}>
                                {movie.episode_current?.includes("Full") ? movie.episode_current : (
                                    movie.episode_current?.includes("Hoàn Tất")
                                        ? movie.episode_current
                                        : `${movie.episode_current || 0} / ${movie.episode_total || '?'}`
                                )
                                }
                            </span>

                        </div>

                        <div className="hidden md:flex items-center gap-3">
                            <Link
                                // FIX: Dùng biến episodeToWatch thay vì firstEpisode
                                to={serverData.length > 0 ? `/phim/${movie.slug}/${episodeToWatch?.slug}` : '#'}
                                onClick={() => serverData.length > 0 && handleWatchMovie(episodeToWatch)}
                                className="flex-shrink-0 flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-8 py-2.5 rounded-full shadow-lg shadow-amber-400/30 transition-all hover:scale-105 active:scale-95"
                            >
                                <FiPlay className="fill-current text-lg" />
                                {/* FIX: Đổi text nút cho hợp lý */}
                                {lastWatchedEpisode ? "Xem Tiếp" : "Xem Phim"}
                            </Link>

                            {/* Nút Share Mới */}
                            <button
                                onClick={handleCopyLink}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold border-2 transition-all hover:scale-105 active:scale-95 ${isCopied
                                    ? 'bg-green-50 border-green-500 text-green-600'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-amber-400 hover:text-amber-500 hover:shadow-md'
                                    }`}
                            >
                                {isCopied ? (
                                    <>
                                        <FiCheck className="text-lg animate-bounce" />
                                        <span>Đã Copy</span>
                                    </>
                                ) : (
                                    <>
                                        <FiShare2 className="text-lg" />
                                        <span>Chia sẻ</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. CONTENT SPLIT */}
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">

                    {/* === LEFT: THÔNG TIN PHIM (3 Phần) === */}
                    <div className="lg:col-span-3">
                        <button
                            onClick={() => setIsShowInfo(!isShowInfo)}
                            className="lg:hidden w-full flex items-center justify-center gap-2 mb-4 group select-none outline-none py-2"
                        >
                            <span className="text-[17px] font-bold text-amber-500 group-hover:text-amber-600 transition-colors">
                                Thông tin phim
                            </span>

                            <FiChevronDown
                                className={`text-amber-500 text-xl transition-transform duration-300 ${isShowInfo ? '-rotate-180' : 'rotate-0'}`}
                            />
                        </button>

                        <div className={`space-y-8 transition-all duration-300 ease-in-out ${isShowInfo ? 'block animate-in fade-in slide-in-from-top-4' : 'hidden'} lg:block lg:animate-none`}>

                            {/* Box 1: Giới thiệu (Introduction) */}
                            <div className="group bg-white rounded-2xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl">
                                        <FiAlignLeft className="text-xl" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                                        Giới thiệu
                                    </h3>
                                </div>

                                <div className="relative">
                                    <p className="text-slate-600 text-[15px] leading-7 text-justify font-normal">
                                        {decodeHTMLEntities(movie.content) || "Nội dung đang được cập nhật..."}
                                    </p>
                                    {/* Decor trang trí */}
                                    <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-amber-100 rounded-tl-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-amber-100 rounded-br-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>

                            {/* Box 2: Thông tin chi tiết (Details) */}
                            <div className="bg-white rounded-2xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50 border-dashed">
                                    <div className="p-2.5 bg-sky-50 text-sky-500 rounded-xl">
                                        <FiGrid className="text-xl" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                                        Thông tin chi tiết
                                    </h3>
                                </div>

                                <div className="space-y-5">
                                    {/* Thể loại */}
                                    <div>
                                        <span className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-2">
                                            <FiLayers /> Thể loại
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {movie.category?.map((cat) => (
                                                <Link
                                                    key={cat.id}
                                                    to={`/the-loai/${cat.slug}`}
                                                    className="bg-slate-50 border border-slate-200 text-slate-600 hover:text-white hover:bg-sky-500 hover:border-sky-500 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                                                >
                                                    {cat.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quốc gia */}
                                    <div>
                                        <span className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-2">
                                            <FiMapPin /> Quốc gia
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {movie.country?.map(c => (
                                                <span key={c.id} className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold">
                                                    {c.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Đạo diễn */}
                                    <div>
                                        <span className="block text-slate-400 text-xs font-bold uppercase mb-1">
                                            Đạo diễn
                                        </span>
                                        <span className="text-slate-800 font-medium text-sm">
                                            {movie.director?.join(', ') || 'Đang cập nhật'}
                                        </span>
                                    </div>

                                    {/* Diễn viên */}
                                    <div>
                                        <span className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-1">
                                            <FiUser /> Diễn viên Lồng Tiếng
                                        </span>
                                        <span className="text-slate-800 font-medium text-sm leading-relaxed block">
                                            {movie.actor?.join(', ') || 'Đang cập nhật'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: TABS (7 Phần) */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden sticky ">

                            {/* Tabs Nav */}
                            <div className="flex border-b border-slate-100 bg-slate-50/50">
                                <button onClick={() => setActiveTab('episodes')} className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold text-sm transition-all ${activeTab === 'episodes' ? 'bg-white text-amber-600 border-t-2 border-amber-500 shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
                                    <FiLayers className="text-lg" /> Tập Phim
                                </button>
                                <button onClick={() => setActiveTab('trailer')} className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold text-sm transition-all ${activeTab === 'trailer' ? 'bg-white text-amber-600 border-t-2 border-amber-500 shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
                                    <FiYoutube className="text-lg" /> Trailer
                                </button>
                                <button onClick={() => setActiveTab('photos')} className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold text-sm transition-all ${activeTab === 'photos' ? 'bg-white text-amber-600 border-t-2 border-amber-500 shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
                                    <FiImage className="text-lg" /> Hình Ảnh
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6 min-h-[400px]">

                                {/* 1. EPISODES */}
                                {/* 1. EPISODES */}
                                {activeTab === 'episodes' && (
                                    <div className="animate-in fade-in zoom-in-95 duration-300">

                                        {/* --- PHẦN MỚI: DANH SÁCH SERVER (VIETSUB / LỒNG TIẾNG) --- */}
                                        {availableServers.length > 0 && (
                                            <div className="mb-6">
                                                <p className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                                    <FiLayers /> Chọn Server / Ngôn ngữ
                                                </p>
                                                <div className="flex flex-wrap gap-3">
                                                    {availableServers.map((server, index) => {
                                                        // Xử lý tên server cho đẹp (bỏ chữ #Hà Nội nếu muốn)
                                                        // API trả về: "#Hà Nội (Vietsub)" -> Hiển thị: "Vietsub"
                                                        const serverName = server.server_name.replace('#Hà Nội', '').trim().replace(/[()]/g, '') || server.server_name;

                                                        const isActive = currentServerIndex === index;

                                                        return (
                                                            <button
                                                                key={index}
                                                                onClick={() => setCurrentServerIndex(index)}
                                                                className={`
                                    px-4 py-2 rounded-lg text-sm font-bold transition-all border
                                    ${isActive
                                                                        ? 'bg-amber-400 border-amber-400 text-white shadow-lg shadow-amber-400/30 transform scale-105'
                                                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-amber-300'
                                                                    }
                                `}
                                                            >
                                                                {serverName}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        {/* --------------------------------------------------------- */}

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
                                                <h3 className="font-bold text-slate-800">
                                                    {/* Hiển thị tên server đang chọn */}
                                                    {currentServer?.server_name || "Danh Sách Tập"}
                                                </h3>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {/* Nút Sắp Xếp (Giữ nguyên) */}
                                                <button
                                                    onClick={() => setSortDesc(!sortDesc)}
                                                    className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:border-amber-400 hover:text-amber-500 px-3 py-1 rounded-lg transition-all shadow-sm active:scale-95"
                                                >
                                                    {sortDesc ? (
                                                        <>
                                                            <span className='hidden sm:inline'>Mới nhất</span> <FiArrowUp className="text-sm" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className='hidden sm:inline'>Cũ nhất</span> <FiArrowDown className="text-sm" />
                                                        </>
                                                    )}
                                                </button>

                                                {/* Số lượng tập */}
                                                <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-lg border border-slate-200">
                                                    {serverData.length} tập
                                                </span>
                                            </div>
                                        </div>

                                        {/* Render danh sách tập phim (Dựa trên serverData đã tính toán ở trên) */}
                                        {serverData.length > 0 ? (
                                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                                                {[...serverData]
                                                    .sort((a, b) => {
                                                        const getNum = (str: string) => parseInt(str.toString().replace(/\D/g, '')) || 0;
                                                        return sortDesc ? getNum(b.name) - getNum(a.name) : getNum(a.name) - getNum(b.name);
                                                    })
                                                    .map((ep, index) => {
                                                        const isWatched = watchedEpisodes.includes(ep.slug);

                                                        return (
                                                            <Link
                                                                key={index}
                                                                to={`/phim/${movie.slug}/${ep.slug}?sv=${currentServerIndex}`}
                                                                onClick={() => handleWatchMovie(ep)}
                                                                className="group block"
                                                            >
                                                                <div className={`
                                                                            border rounded-lg py-2 px-1 text-center transition-all duration-200 shadow-sm
                                                                            ${isWatched
                                                                        ? 'bg-slate-200 text-slate-400 border-slate-200 shadow-inner'
                                                                        : 'bg-gray-50 text-slate-600 border-slate-200 hover:bg-amber-400 hover:text-white hover:border-amber-400 hover:shadow-md'
                                                                    }
                                                                            ${/* Highlight tập đang chọn nếu cần */ ''}
                                                                        `}>
                                                                    <span className="text-xs font-bold truncate block">
                                                                        {ep.name}
                                                                    </span>
                                                                </div>
                                                            </Link>
                                                        );
                                                    })}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                                <FiLayers className="text-4xl mb-2 opacity-30" />
                                                <p>Chưa có tập phim nào cho server này.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* 2. TRAILER */}
                                {activeTab === 'trailer' && (
                                    <div className="flex items-center justify-center">
                                        {youtubeId ? (
                                            <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg ring-1 ring-slate-900/5">
                                                <iframe src={`https://www.youtube.com/embed/${youtubeId}`} title="Trailer" className="w-full h-full" allowFullScreen />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 w-full">
                                                <FiYoutube className="text-5xl mb-3 opacity-30" />
                                                <p>Phim này chưa có Trailer.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* 3. PHOTOS */}
                                {activeTab === 'photos' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <span className="text-xs font-bold text-slate-400 uppercase">Ảnh Bìa</span>
                                            <div className="rounded-xl overflow-hidden shadow-md border border-slate-100 group">
                                                <img src={getPosterUrl(movie.thumb_url)} alt="Thumb" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-xs font-bold text-slate-400 uppercase">Ảnh Poster</span>
                                            <div className="rounded-xl overflow-hidden shadow-md border border-slate-100 w-1/2 mx-auto group">
                                                <img src={getPosterUrl(movie.poster_url)} alt="Poster" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* MOBILE BUTTON */}
            <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-xl border-t border-slate-200 md:hidden z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="flex gap-3">
                    <Link
                        // FIX: Dùng biến episodeToWatch
                        to={serverData.length > 0 ? `/phim/${movie.slug}/${episodeToWatch?.slug}` : '#'}
                        onClick={() => serverData.length > 0 && handleWatchMovie(episodeToWatch)}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 hover:bg-slate-800 transition-all"
                    >
                        <FiPlay className="fill-current text-xl" />
                        {lastWatchedEpisode ? "Xem Tiếp" : "Xem Ngay"}
                    </Link>

                    {/* Nút Share Mobile */}
                    <button
                        onClick={handleCopyLink}
                        className="w-12 flex items-center justify-center bg-slate-100 text-slate-600 rounded-xl border border-slate-200 active:scale-90 active:bg-slate-200 transition-all"
                    >
                        {isCopied ? <FiCheck className="text-xl text-green-600" /> : <FiShare2 className="text-xl" />}
                    </button>
                </div>
            </div>

        </div>
    );
};

export default MovieDetail;