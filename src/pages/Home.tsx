import React, { useEffect, useState, useCallback } from 'react';
import movieApi from '../api/movieApi';
import Loading from '../components/common/Loading';
import MovieCard from '../components/common/MovieCard';
import RankingBoard from '../components/home/RankingBoard'; // Đảm bảo đường dẫn đúng
import { FiChevronLeft, FiChevronRight, FiRefreshCw } from 'react-icons/fi';
import HeroBanner from '../components/home/HeroBanner';
import TopTrendingSection from '../components/home/TopTrendingSection';
import GenreTags from '../components/home/GenreTags';

// Hàm tạo Cache Key cho Home Grid
const getCacheKey = (page: number) => `home_anime_japan_page_${page}`;
const CACHE_EXPIRY_MS = 1000 * 60 * 10; // 10 phút
const RANKING_CACHE_KEY = `ranking_anime_japan_${new Date().getFullYear()}`;
const TRENDING_CACHE_KEY = 'home_trending_anime';

const Home: React.FC = () => {
    // State cho Main Grid
    const [movies, setMovies] = useState<MovieItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageInput, setPageInput] = useState<string>('1');

    const [rankingMovies, setRankingMovies] = useState<MovieItem[]>([]);
    const [rankingLoading, setRankingLoading] = useState<boolean>(true);

    const [trendingMovies, setTrendingMovies] = useState<MovieItem[]>([]);
    const [trendingLoading, setTrendingLoading] = useState<boolean>(true);

    // --- 1. LOGIC FETCH MAIN MOVIES (GIỮ NGUYÊN NHƯ CŨ) ---
    const fetchMovies = useCallback(async (page: number, forceRefresh = false) => {
        setLoading(true);
        if (forceRefresh) setIsRefreshing(true);

        const cacheKey = getCacheKey(page);
        const cachedData = localStorage.getItem(cacheKey);
        const now = Date.now();

        if (!forceRefresh && cachedData) {
            try {
                const parsedCache = JSON.parse(cachedData);
                if (now - parsedCache.timestamp < CACHE_EXPIRY_MS) {
                    setMovies(parsedCache.data);
                    setTotalPages(parsedCache.totalPages || 1);
                    setLoading(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
            } catch (e) {
                localStorage.removeItem(cacheKey);
            }
        }

        try {
            const response = await movieApi.getAnimeJapan(page, 24);
            const items = response.data.items;
            const total = response.data.params.pagination.totalPages;

            const dataToStore = {
                data: items,
                totalPages: total,
                timestamp: Date.now()
            };
            localStorage.setItem(cacheKey, JSON.stringify(dataToStore));

            setMovies(items);
            setTotalPages(total);
        } catch (error) {
            console.error("Lỗi tải phim:", error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, []);

    // --- 2. LOGIC FETCH RANKING MOVIES (MỚI) ---
    useEffect(() => {
        const fetchRanking = async () => {
            setRankingLoading(true);

            // Check cache ranking trước
            const cachedRanking = localStorage.getItem(RANKING_CACHE_KEY);
            if (cachedRanking) {
                setRankingMovies(JSON.parse(cachedRanking));
                setRankingLoading(false);
                return;
            }

            try {
                const currentYear = new Date().getFullYear();
                // Lấy 60 phim của năm nay để sort
                const response = await movieApi.getRankingList(currentYear, 60);
                let list = response.data.items;

                // SORTING CLIENT SIDE: Sắp xếp theo Rating TMDB cao -> thấp
                list.sort((a: any, b: any) => {
                    const voteA = a.tmdb?.vote_average || 0;
                    const voteB = b.tmdb?.vote_average || 0;

                    // Nếu điểm bằng nhau, so sánh số lượng vote
                    if (voteB === voteA) {
                        const countA = a.tmdb?.vote_count || 0;
                        const countB = b.tmdb?.vote_count || 0;
                        return countB - countA;
                    }
                    return voteB - voteA;
                });

                // Cắt lấy Top 10
                const top10 = list.slice(0, 10);

                setRankingMovies(top10);
                localStorage.setItem(RANKING_CACHE_KEY, JSON.stringify(top10));
            } catch (error) {
                console.error("Lỗi tải BXH:", error);
            } finally {
                setRankingLoading(false);
            }
        };

        fetchRanking();
    }, []); // Chạy 1 lần duy nhất khi mount

    // --- Effects & Handlers cho Pagination (Giữ nguyên) ---
    useEffect(() => {
        fetchMovies(currentPage);
        setPageInput(currentPage.toString());
    }, [currentPage, fetchMovies]);

    useEffect(() => {
        const fetchTrending = async () => {
            setTrendingLoading(true);

            // BƯỚC 1: Kiểm tra Cache
            const cachedData = localStorage.getItem(TRENDING_CACHE_KEY);
            const now = Date.now();

            if (cachedData) {
                try {
                    const parsedCache = JSON.parse(cachedData);
                    if (now - parsedCache.timestamp < CACHE_EXPIRY_MS) {
                        setTrendingMovies(parsedCache.data);
                        setTrendingLoading(false);
                        return; // Dừng hàm, không gọi API nữa
                    }
                } catch (e) {
                    localStorage.removeItem(TRENDING_CACHE_KEY);
                }
            }

            try {
                const response = await movieApi.getTrendingAnimeMovies(1, 6);

                if (response.data && response.data.items) {
                    setTrendingMovies(response.data.items);
                    const dataToStore = {
                        data: response.data.items,
                        timestamp: Date.now()
                    };
                    localStorage.setItem(TRENDING_CACHE_KEY, JSON.stringify(dataToStore));
                }
            } catch (error) {
                console.error("Lỗi tải Top Trending:", error);
            } finally {
                setTrendingLoading(false);
            }
        };

        fetchTrending();
    }, []);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) setCurrentPage(page);
    };

    const handleReset = () => {
        const key = getCacheKey(currentPage);
        localStorage.removeItem(key);
        fetchMovies(currentPage, true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val === '' || /^\d+$/.test(val)) setPageInput(val);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            let pageNumber = parseInt(pageInput);
            if (isNaN(pageNumber)) {
                setPageInput(currentPage.toString());
                return;
            }
            if (pageNumber < 1) pageNumber = 1;
            if (pageNumber > totalPages) pageNumber = totalPages;
            setCurrentPage(pageNumber);
            setPageInput(pageNumber.toString());
            (e.target as HTMLInputElement).blur();
        }
    };

    const handleInputBlur = () => {
        setPageInput(currentPage.toString());
    };

    // Render chính
    return (
        <div className="container mx-auto px-4 pb-10 pt-6">
            <HeroBanner movies={movies} loading={rankingLoading} />

            <GenreTags />

            <div className="my-8 bg-gray-100 p-6 rounded-3xl shadow-xl shadow-slate-900/20 -mx-4 md:mx-0">
                <TopTrendingSection movies={trendingMovies} loading={trendingLoading} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">

                {/* === LEFT CONTENT (7 Phần) === */}
                <div className="lg:col-span-7 flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex items-center justify-between px-2">
                        <div className="flex flex-col">
                            <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600 drop-shadow-sm">
                                Anime Mới
                            </h1>
                            <p className="text-sm text-slate-500 font-medium mt-1">Cập nhật liên tục & nhanh chóng</p>
                        </div>
                        <button onClick={handleReset} disabled={isRefreshing} className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-white shadow-sm text-slate-600 text-sm font-bold hover:text-sky-600 hover:shadow-sky-200/50 hover:shadow-md transition-all active:scale-95 disabled:opacity-50">
                            <FiRefreshCw className={`text-lg transition-transform duration-500 ${isRefreshing ? 'animate-spin text-sky-500' : 'group-hover:rotate-180'}`} />
                            <span className="hidden sm:inline">Làm mới</span>
                        </button>
                    </div>

                    {/* Movie Grid */}
                    {loading && !isRefreshing ? (
                        <Loading message={`Đang tải trang ${currentPage}...`} className="h-[50vh]" />
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 min-h-[50vh]">
                                {movies.map((movie) => (
                                    <div key={movie._id} className="relative hover:z-50 transition-all duration-300">
                                        <MovieCard movie={movie} />
                                    </div>
                                ))}
                            </div>

                            {/* Empty State */}
                            {movies.length === 0 && (
                                <div className="text-center py-20 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    Không tìm thấy phim nào.
                                </div>
                            )}
                        </>
                    )}

                    {/* Pagination UI */}
                    {!loading && movies.length > 0 && (
                        <div className="flex justify-center w-full mt-4">
                            <div className="flex items-center gap-2 p-1.5 bg-white/80 backdrop-blur-xl border border-white/50 rounded-full shadow-lg shadow-sky-500/5 ring-1 ring-slate-100">
                                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm active:scale-95">
                                    <FiChevronLeft size={20} />
                                </button>
                                <div className="flex items-center gap-2 px-4">
                                    <span className="text-slate-500 font-bold text-sm hidden sm:inline">Trang</span>
                                    <input type="text" inputMode="numeric" value={pageInput} onChange={handleInputChange} onKeyDown={handleInputKeyDown} onBlur={handleInputBlur} className="w-14 text-center bg-slate-50 text-slate-700 font-extrabold text-lg rounded-xl py-1.5 border border-slate-200 focus:bg-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all shadow-inner" />
                                    <span className="text-slate-400 font-semibold text-sm">/ {totalPages}</span>
                                </div>
                                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm active:scale-95">
                                    <FiChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* === RIGHT SIDEBAR (3 Phần) - BẢNG XẾP HẠNG === */}
                <div className="lg:col-span-3">
                    <RankingBoard movies={rankingMovies} loading={rankingLoading} />
                </div>

            </div>

        </div>
    );
};

export default Home;