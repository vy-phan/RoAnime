import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import movieApi from '../api/movieApi';
import MovieCard from '../components/common/MovieCard';
import Loading from '../components/common/Loading';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProtectedImage from '../components/common/ProtectedImage';

const SearchPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Lấy keyword và page từ URL
    const keyword = searchParams.get('keyword') || '';
    const currentPage = Number(searchParams.get('page')) || 1;

    const [movies, setMovies] = useState<MovieItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalItemsPerPage: 24,
        currentPage: 1,
        totalPages: 1
    });

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!keyword) {
                setMovies([]);
                setPagination({
                    totalItems: 0,
                    totalItemsPerPage: 24,
                    currentPage: 1,
                    totalPages: 1
                });
                return;
            }
            
            setLoading(true);
            try {
                const response = await movieApi.searchMovies(keyword, currentPage);
                
                // Kiểm tra an toàn response và data
                if (response && response.data) {
                    // Đảm bảo items luôn là mảng
                    const items = Array.isArray(response.data.items) 
                        ? response.data.items 
                        : [];
                    
                    setMovies(items);
                    
                    // Kiểm tra pagination có tồn tại không
                    if (response.data.params && response.data.params.pagination) {
                        setPagination(response.data.params.pagination);
                    } else {
                        setPagination({
                            totalItems: items.length,
                            totalItemsPerPage: 24,
                            currentPage: currentPage,
                            totalPages: 1
                        });
                    }
                } else {
                    // Không có kết quả hoặc response không hợp lệ
                    setMovies([]);
                    setPagination({
                        totalItems: 0,
                        totalItemsPerPage: 24,
                        currentPage: currentPage,
                        totalPages: 1
                    });
                }
            } catch (error) {
                console.error("Lỗi tìm kiếm:", error);
                setMovies([]);
                setPagination({
                    totalItems: 0,
                    totalItemsPerPage: 24,
                    currentPage: currentPage,
                    totalPages: 1
                });
            } finally {
                setLoading(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        fetchSearchResults();
    }, [keyword, currentPage]);

    // Hàm chuyển trang
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            // Cập nhật URL, giữ nguyên keyword, thay đổi page
            setSearchParams({ keyword, page: newPage.toString() });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-10 pt-6">
            <div className="container mx-auto px-4">
                
                {/* 1. Header Kết quả */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-xl shadow-sm">
                            <FiSearch className="text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-black text-slate-800">
                                Kết quả tìm kiếm: <span className="text-amber-600">"{keyword}"</span>
                            </h1>
                            <p className="text-sm text-slate-500 font-medium mt-1">
                                Tìm thấy {pagination.totalItems} bộ phim phù hợp
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Loading State */}
                {loading ? (
                    <Loading message={`Đang tìm kiếm "${keyword}"...`} />
                ) : (
                    <>
                        {/* 3. Danh sách phim (Grid) */}
                        {movies && Array.isArray(movies) && movies.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {movies.map((movie) => (
                                    <MovieCard key={movie._id} movie={movie} />
                                ))}
                            </div>
                        ) : (
                            // 4. Empty State (Không tìm thấy - Đẹp & To hơn)
                            <div className="flex flex-col items-center justify-center py-24 bg-gradient-to-b from-white via-slate-50 to-amber-50 rounded-3xl shadow-xl border border-dashed border-amber-200 mx-auto ">
                                <div className="w-48 h-48 md:w-56 md:h-56 aspect-square relative rounded-2xl overflow-hidden shadow-lg bg-amber-100 flex items-center justify-center mb-8 animate-bounce-slow">
                                    <ProtectedImage 
                                        src='/aqua.png' 
                                        alt='Không tìm thấy kết quả' 
                                        className='w-full h-full object-contain object-bottom scale-110' 
                                    />
                                    {/* Viền sáng đẹp */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-200/40 via-white/10 to-amber-100/60 pointer-events-none" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-700 mb-3 text-center drop-shadow-sm">
                                    Không tìm thấy phim nào
                                </h3>
                                <p className="text-base text-slate-500 text-center max-w-lg px-4 mb-4 font-medium">
                                    Rất tiếc, không có kết quả nào phù hợp với từ khóa <span className="text-amber-600 font-semibold">"{keyword}"</span>. 
                                    <br/>Hãy thử tìm bằng từ khóa khác, tên tiếng Anh hoặc kiểm tra lại chính tả nhé!
                                </p>
                                <a 
                                    href="/"
                                    className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-amber-400/90 hover:bg-amber-500 transition rounded-full text-white font-bold shadow-md shadow-amber-200/30 text-base"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 17v-6a5 5 0 0 0-10 0v6m-2 0a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2m-8 0V11m8 6V11" /></svg>
                                    Về trang chủ
                                </a>
                            </div>
                        )}

                        {/* 5. Pagination (Chỉ hiện khi có nhiều hơn 1 trang) */}
                        {!loading && movies && Array.isArray(movies) && movies.length > 0 && pagination.totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-12">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-5 py-2.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:text-amber-600 disabled:opacity-50 disabled:cursor-not-allowed bg-white transition-all flex items-center gap-2 font-bold text-sm shadow-sm"
                                >
                                    <FiChevronLeft /> Trước
                                </button>

                                <span className="px-5 py-2.5 bg-amber-50 text-amber-600 font-bold rounded-xl border border-amber-100 text-sm">
                                    {currentPage} / {pagination.totalPages}
                                </span>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === pagination.totalPages}
                                    className="px-5 py-2.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:text-amber-600 disabled:opacity-50 disabled:cursor-not-allowed bg-white transition-all flex items-center gap-2 font-bold text-sm shadow-sm"
                                >
                                    Sau <FiChevronRight />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchPage;