import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import movieApi from '../api/movieApi';
import MovieCard from '../components/common/MovieCard';
import Loading from '../components/common/Loading';
import { FiSearch, FiFrown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

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
            if (!keyword) return;
            
            setLoading(true);
            try {
                const response = await movieApi.searchMovies(keyword, currentPage);
                if (response.status === 'success' || response.data) {
                    setMovies(response.data.items);
                    setPagination(response.data.params.pagination);
                } else {
                    setMovies([]); // Không có kết quả hoặc lỗi
                }
            } catch (error) {
                console.error("Lỗi tìm kiếm:", error);
                setMovies([]);
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
                        {movies.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {movies.map((movie) => (
                                    <MovieCard key={movie._id} movie={movie} />
                                ))}
                            </div>
                        ) : (
                            // 4. Empty State (Không tìm thấy)
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <FiFrown className="text-5xl text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-700 mb-2">Không tìm thấy phim nào</h3>
                                <p className="text-slate-500 text-center max-w-md px-4">
                                    Rất tiếc, không có kết quả nào phù hợp với từ khóa <strong>"{keyword}"</strong>. 
                                    <br/>Hãy thử tìm bằng từ khóa khác hoặc tên tiếng Anh xem sao nhé!
                                </p>
                            </div>
                        )}

                        {/* 5. Pagination (Chỉ hiện khi có nhiều hơn 1 trang) */}
                        {!loading && movies.length > 0 && pagination.totalPages > 1 && (
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