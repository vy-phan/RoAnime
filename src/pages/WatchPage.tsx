import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import movieApi from '../api/movieApi';
import Loading from '../components/common/Loading';
import {
    FiChevronRight, FiAlertCircle, FiChevronLeft, FiHome,
    FiShare2, FiFastForward, FiMonitor, FiArrowUp, FiArrowDown,
    FiLayers,
    FiCheck
} from 'react-icons/fi'; // Thêm icon Arrow cho sort
import { decodeHTMLEntities } from '../utils/textFomat';
import { addToHistory, getMovieHistory } from '../utils/history';

const WatchPage: React.FC = () => {
    const { slug, episodeSlug } = useParams<{ slug: string; episodeSlug: string }>();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [movie, setMovie] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // --- States UI ---
    const [isCinemaMode, setIsCinemaMode] = useState(false);
    const [autoNext, setAutoNext] = useState(true);
    const [isReversed, setIsReversed] = useState(false); // State sắp xếp tập phim
    const [watchedEpisodes, setWatchedEpisodes] = useState<string[]>([]);
    const [isCopied, setIsCopied] = useState(false);
    const handleCopyLink = () => {
        // Copy link hiện tại vào bộ nhớ tạm
        navigator.clipboard.writeText(window.location.href);

        // Hiển thị trạng thái "Đã copy"
        setIsCopied(true);

        // Sau 2 giây tự động quay lại trạng thái cũ
        setTimeout(() => setIsCopied(false), 2000);
    };
    // 1. Fetch dữ liệu
    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                const response = await movieApi.getMovieDetail(slug);
                if (response.status) {
                    const movieData = {
                        ...response.movie,
                        episodes: response.episodes || []
                    };
                    setMovie(movieData);
                } else {
                    setError("Không tìm thấy phim.");
                }
            } catch (err) {
                console.error(err);
                setError("Lỗi kết nối server.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    // 2. Logic tìm tập phim hiện tại & danh sách tập hiển thị
    const { currentEpisode, episodeListDisplay, currentServer, serverList } = useMemo(() => {
        if (!movie || !episodeSlug) return {
            currentEpisode: null,
            episodeListDisplay: [],
            currentServer: null,
            serverList: []
        };

        const serverList = movie.episodes || [];

        // Lấy index từ URL (?sv=1), nếu không có thì mặc định là 0
        const serverIndexParam = parseInt(searchParams.get('sv') || '0');

        // Đảm bảo index hợp lệ, nếu sai quay về 0
        const activeServerIndex = (serverIndexParam >= 0 && serverIndexParam < serverList.length)
            ? serverIndexParam
            : 0;

        const server = serverList[activeServerIndex];

        if (!server) return { currentEpisode: null, episodeListDisplay: [], currentServer: null, serverList: [] };

        // Tìm tập hiện tại trong server ĐANG CHỌN
        const episodeIndex = server.server_data.findIndex((ep: any) => ep.slug === episodeSlug);

        // Nếu không tìm thấy tập phim trong server này (trường hợp đổi server mà server mới không có tập đó)
        // -> Fallback về tập đầu tiên hoặc xử lý redirect (ở đây ta chọn tập đầu tiên tạm thời)
        const safeEpisodeIndex = episodeIndex !== -1 ? episodeIndex : 0;
        const episode = server.server_data[safeEpisodeIndex];

        const currentEpData = episode ? {
            episode,
            serverName: server.server_name,
            nextEpisode: server.server_data[safeEpisodeIndex + 1],
            prevEpisode: server.server_data[safeEpisodeIndex - 1]
        } : null;

        const listToDisplay = [...server.server_data];
        if (isReversed) listToDisplay.reverse();

        return {
            currentEpisode: currentEpData,
            episodeListDisplay: listToDisplay,
            currentServer: server,
            serverList: serverList // Trả về danh sách server để render nút chọn
        };
    }, [movie, episodeSlug, isReversed, searchParams]);

    // Scroll top khi chuyển tập
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [episodeSlug]);

    const handleChangeServer = (index: number) => {
        setSearchParams({ sv: index.toString() });
    };

    useEffect(() => {
        if (movie && currentEpisode?.episode) {
            addToHistory(movie, currentEpisode.episode);
            console.log("Đã lưu lịch sử:", movie.name, currentEpisode.episode.name);
        }
    }, [movie, currentEpisode]);

    // Logic khóa scroll body khi bật Cinema Mode
    useEffect(() => {
        document.body.style.overflow = isCinemaMode ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [isCinemaMode]);

    useEffect(() => {
        if (slug) {
            const history = getMovieHistory(slug);
            if (history && history.watchedEpisodes) {
                setWatchedEpisodes(history.watchedEpisodes);
            }
        }
    }, [slug]);


    if (loading) return <Loading message="Đang tải video..." className="h-screen bg-white" />;

    if (error || !movie) return (
        <div className="h-screen flex flex-col items-center justify-center bg-white text-gray-600 gap-4">
            <FiAlertCircle className="text-5xl text-red-500" />
            <p className="text-xl font-bold">{error || "Phim không tồn tại"}</p>
            <Link to="/" className="px-6 py-2 bg-amber-400 text-gray-900 rounded-full font-bold hover:bg-amber-500 transition">Về trang chủ</Link>
        </div>
    );

    return (
        <div className={`min-h-screen font-sans pb-20 transition-colors duration-300 ${isCinemaMode ? 'bg-black' : 'bg-white'}`}>

            {/* 1. BREADCRUMB (Ẩn khi bật Rạp phim) */}
            {!isCinemaMode && (
                <div className="bg-white border-b border-gray-100 py-3 px-4 sticky top-0 z-40">
                    <div className="container mx-auto">
                        <nav className="flex items-center flex-wrap gap-1 text-[11px] md:text-xs font-medium text-gray-500">
                            <Link to="/" className="hover:text-amber-500 transition-colors flex items-center gap-1"><FiHome /> Trang chủ</Link>
                            <FiChevronRight className="text-gray-300" />
                            <Link to={`/phim/${slug}`} className="hover:text-amber-500 transition-colors font-bold text-gray-700 truncate max-w-[200px]">
                                {movie.name}
                            </Link>
                            <FiChevronRight className="text-gray-300" />
                            <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                {currentEpisode?.episode.name}
                            </span>
                        </nav>
                    </div>
                </div>
            )}

            {/* 
         2. PLAYER SCREEN
         - Khi Cinema Mode: Fixed full màn hình.
      */}
            <div className={`
          transition-all duration-500 ease-in-out
          ${isCinemaMode
                    ? 'fixed inset-0 z-[100] bg-black flex items-center justify-center'
                    : 'container mx-auto px-0 md:px-4 mt-6 relative z-0'}
      `}>
                <div className={`
              w-full bg-black overflow-hidden relative shadow-2xl transition-all duration-500
              ${isCinemaMode
                        ? 'w-full h-full' // Full width/height trong rạp
                        : 'aspect-video rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]'}
          `}>
                    {currentEpisode ? (
                        <iframe
                            src={currentEpisode.episode.link_embed}
                            key={currentEpisode.episode.link_embed}
                            title={currentEpisode.episode.name}
                            className={`w-full h-full ${isCinemaMode ? 'max-h-screen' : ''}`}
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            style={{ pointerEvents: 'auto' }}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-900">
                            <FiAlertCircle className="text-4xl mb-2" />
                            <span className="text-sm">Không tìm thấy tập phim này.</span>
                        </div>
                    )}
                </div>
            </div>

            {/* 
         3. CONTROL BAR 
         - FIX QUAN TRỌNG: Thêm 'pointer-events-none' cho container cha khi ở chế độ Rạp phim.
         - Điều này giúp click chuột "xuyên qua" vùng trống của thanh điều khiển xuống iframe bên dưới.
         - Các nút con (button) phải set 'pointer-events-auto' để vẫn click được.
      */}
            <div className={`
          transition-all duration-300
          ${isCinemaMode
                    ? 'fixed bottom-0 left-0 w-full z-[101] bg-gradient-to-t from-black/90 via-black/60 to-transparent pb-8 pt-20 px-4 pointer-events-none'
                    : 'container mx-auto px-3 md:px-4 mt-5 mb-8 relative z-0'}
      `}>
                <div className={`
            flex flex-col xl:flex-row items-center justify-between gap-6
            ${isCinemaMode
                        ? 'max-w-7xl mx-auto'
                        : 'bg-gray-50 rounded-2xl px-5 py-4 border border-gray-100 shadow-sm'}
        `}>

                    {/* Left Buttons: Pointer-events-auto để click được */}
                    <div className={`flex items-center gap-4 w-full xl:w-auto transition-opacity pointer-events-auto ${isCinemaMode ? 'opacity-20 hover:opacity-100' : 'opacity-100'}`}>
                        <button
                            onClick={() => currentEpisode?.prevEpisode && navigate(`/phim/${slug}/${currentEpisode.prevEpisode.slug}?${searchParams.toString()}`)}
                            disabled={!currentEpisode?.prevEpisode}
                            className={`
                        flex-1 xl:flex-none h-10 px-6 rounded-full font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2
                        ${isCinemaMode
                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-200'}
                     `}
                        >
                            <FiChevronLeft /> Tập trước
                        </button>
                        <button
                            onClick={() => currentEpisode?.nextEpisode && navigate(`/phim/${slug}/${currentEpisode.nextEpisode.slug}?${searchParams.toString()}`)}
                            disabled={!currentEpisode?.nextEpisode}
                            className={`
                        flex-1 xl:flex-none h-10 px-6 rounded-full font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2
                        ${isCinemaMode
                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-200'}
                     `}
                        >
                            Tập tiếp theo <FiChevronRight />
                        </button>
                    </div>

                    {/* Right Buttons: Pointer-events-auto */}
                    <div className="flex flex-wrap items-center justify-center xl:justify-end gap-x-6 gap-y-3 w-full xl:w-auto border-t xl:border-t-0 border-gray-200 pt-4 xl:pt-0 pointer-events-auto">

                        <button
                            onClick={() => setAutoNext(!autoNext)}
                            className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-full transition-all cursor-pointer select-none ${isCinemaMode ? 'text-gray-400 opacity-20 hover:opacity-100 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-200'}`}
                        >
                            <FiFastForward className="text-lg" />
                            <span>Tự chuyển tập</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all ml-1 ${autoNext ? 'bg-amber-400 text-white' : 'bg-gray-300 text-gray-500'}`}>
                                {autoNext ? 'ON' : 'OFF'}
                            </span>
                        </button>

                        <button
                            onClick={() => setIsCinemaMode(!isCinemaMode)}
                            className={`
                        flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-full transition-all cursor-pointer ring-2 ring-offset-2 ring-offset-transparent
                        ${isCinemaMode
                                    ? 'bg-amber-500/10 ring-amber-500 text-amber-500 hover:bg-amber-500/20'
                                    : 'text-gray-600 hover:bg-gray-200 ring-transparent'}
                    `}
                        >
                            <FiMonitor className="text-lg" />
                            <span>Rạp phim</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all ml-1 ${isCinemaMode ? 'bg-amber-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                                {isCinemaMode ? 'ON' : 'OFF'}
                            </span>
                        </button>

                        <button
                            onClick={handleCopyLink}
                            className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-full transition-all ${isCinemaMode ? 'text-gray-400 opacity-20 hover:opacity-100 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-200'}`}>
                            {isCopied ? <FiCheck className="text-lg text-green-500" /> : <FiShare2 className="text-lg" />}
                            <span className={isCopied ? "text-green-500 font-bold" : ""}>
                                {isCopied ? "Đã copy link" : "Chia sẻ"}
                            </span>
                        </button>

                    </div>
                </div>
            </div>

            {/* 4. MAIN CONTENT GRID (Ẩn khi Cinema Mode) */}
            <div className={`container mx-auto px-3 md:px-4 transition-opacity duration-500 ${isCinemaMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">

                    {/* CỘT TRÁI (7 PHẦN) */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* Info Card */}
                        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-row gap-4 sm:gap-6 items-start">
                            <div className="w-24 sm:w-[160px] flex-shrink-0">
                                <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-md border border-gray-100">
                                    <img
                                        src={movie.poster_url || movie.thumb_url || "https://via.placeholder.com/300x450?text=No+Image"}
                                        alt={movie.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-lg sm:text-2xl font-black text-gray-800 leading-tight mb-1 sm:mb-2">{movie.name}</h1>
                                <h2 className="text-xs sm:text-sm font-medium text-gray-500 mb-3">{movie.origin_name}</h2>

                                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                                    <span className="bg-amber-400 text-white px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold">HD</span>
                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold border border-gray-200">{movie.year}</span>
                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold border border-gray-200">{movie.time}</span>
                                    {movie.category?.slice(0, 3).map((cat: any) => (
                                        <Link key={cat.id} to={`/the-loai/${cat.slug}`} className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] sm:text-xs font-medium border border-gray-200 hover:bg-gray-800 hover:text-white">{cat.name}</Link>
                                    ))}
                                </div>

                                <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-100">
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed text-justify line-clamp-4 sm:line-clamp-none">
                                        {decodeHTMLEntities(movie.content)}
                                    </p>
                                    <div className="block sm:hidden mt-2 pt-2 border-t border-gray-200">
                                        <Link to={`/phim/${slug}`} className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700">
                                            Xem chi tiết phim <FiChevronRight />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- LIST EPISODES (Có Sort) --- */}
                        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                            {serverList.length > 1 && (
                                <div className="mb-6 pb-4 border-b border-gray-100">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                        <FiLayers /> Chọn Server / Ngôn ngữ
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {serverList.map((srv: any, idx: number) => {
                                            const currentSvIndex = parseInt(searchParams.get('sv') || '0');
                                            const isActive = currentSvIndex === idx;
                                            const serverName = srv.server_name.replace('#Hà Nội', '').trim().replace(/[()]/g, '') || srv.server_name;

                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleChangeServer(idx)}
                                                    className={`
                                                        px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all border flex items-center gap-2
                                                        ${isActive
                                                            ? 'bg-amber-400 border-amber-400 text-white shadow-md'
                                                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-white hover:border-amber-400 hover:text-amber-500'}
                                                    `}
                                                >
                                                    {serverName}
                                                    {isActive && <FiCheck />}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-base sm:text-lg font-bold text-gray-800 uppercase flex items-center gap-2">
                                        <span className="w-1 h-5 bg-amber-400 rounded-full inline-block"></span>
                                        Danh sách tập
                                    </h3>
                                    <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded font-medium border border-gray-200 truncate max-w-[100px] sm:max-w-none">
                                        {currentServer?.server_name || "Server mặc định"}
                                    </span>
                                </div>

                                <button
                                    onClick={() => setIsReversed(!isReversed)}
                                    className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-amber-600 transition-colors bg-gray-50 hover:bg-amber-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-amber-200"
                                >
                                    {isReversed ? <FiArrowUp /> : <FiArrowDown />}
                                    {isReversed ? "Mới nhất" : "Cũ nhất"}
                                </button>
                            </div>

                            {/* Episodes Grid */}
                            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                                {episodeListDisplay.map((ep: any) => {
                                    const isActive = ep.slug === episodeSlug; // Tập đang xem
                                    const isWatched = watchedEpisodes.includes(ep.slug); // Tập đã xem

                                    return (
                                        <Link
                                            key={ep.slug}
                                            to={`/phim/${slug}/${ep.slug}?${searchParams.toString()}`}
                                            className={`
                                                py-2 px-1 text-center rounded-lg text-[11px] sm:text-xs font-bold transition-all border
                                                ${isActive
                                                    ? 'bg-amber-400 text-white border-amber-400 shadow-md shadow-amber-200' // Đang xem: Màu vàng nổi bật
                                                    : isWatched
                                                        ? 'bg-gray-200 text-gray-400 border-gray-200 shadow-inner' // Đã xem: Màu xám chìm
                                                        : isCinemaMode
                                                            ? 'bg-[#2a2a2a] text-gray-400 border-[#333] hover:bg-[#444] hover:text-white' // Chưa xem (Rạp phim)
                                                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-white hover:border-amber-400 hover:text-amber-600' // Chưa xem (Thường)
                                                }
                `}
                                        >
                                            {ep.name.replace('Tập ', '')}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI (3 PHẦN) - Dữ liệu Actor thật từ API */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-fit sticky top-20">
                            <h3 className="text-lg font-bold mb-6 text-gray-800 border-l-4 border-amber-400 pl-3">
                                Diễn viên
                            </h3>

                            {movie.actor && movie.actor.length > 0 ? (
                                <div className="grid grid-cols-3 gap-x-2 gap-y-6">
                                    {movie.actor.map((actorName: string, idx: number) => (
                                        <div key={idx} className="flex flex-col items-center group cursor-pointer">
                                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm group-hover:border-amber-400 transition-all duration-300">
                                                {/* Tạo ảnh avatar từ tên diễn viên */}
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(actorName)}&background=random&color=fff&size=128`}
                                                    alt={actorName}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                            <a
                                                href={`https://www.google.com/search?q=${encodeURIComponent(actorName)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-2 text-[11px] sm:text-xs text-center text-gray-600 font-bold leading-tight group-hover:text-amber-600 transition-colors line-clamp-2 hover:underline"
                                            >
                                                {actorName}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 text-center italic">Đang cập nhật diễn viên...</p>
                            )}

                            
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default WatchPage;