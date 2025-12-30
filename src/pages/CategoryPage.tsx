import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import movieApi from '../api/movieApi';
import MovieCard from '../components/common/MovieCard';
import Loading from '../components/common/Loading';
import Pagination from '../components/common/Pagination'; 
import { FiFilter, FiAlertCircle } from 'react-icons/fi';

const CategoryPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Lấy page từ URL, mặc định là 1
    const currentPage = Number(searchParams.get('page')) || 1;

    const [movies, setMovies] = useState<MovieItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
    });


    const formatTitle = (slug: string | undefined) => {
        if (!slug) return "Danh sách phim";
        return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                const response = await movieApi.getMoviesByCategory(slug, currentPage);
                if (response.status === 'success' || response.data) {
                    setMovies(response.data.items);
                    setPagination(response.data.params.pagination);
                } else {
                    setMovies([]);
                }
            } catch (error) {
                console.error("Lỗi tải danh sách phim:", error);
                setMovies([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [slug, currentPage]);

    // Hàm chuyển trang (Đơn giản hóa nhờ dùng useSearchParams)
    const handlePageChange = (newPage: number) => {
        setSearchParams({ page: newPage.toString() });
    };

    if (loading) return <Loading message={`Đang tải phim ${formatTitle(slug)}...`} />;

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans">
            <div className="container mx-auto px-4 pt-8">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-6">
                    <div className="flex items-center gap-4">
                        {/* Icon đại diện cho Category - dùng màu Amber để nổi bật */}
                        <div className="p-3.5 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl shadow-lg shadow-amber-500/30 -rotate-3">
                            <FiFilter className="text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">
                                {formatTitle(slug)}
                            </h1>
                            <p className="text-slate-500 font-medium text-sm mt-1">
                                Danh sách anime được phân loại
                            </p>
                        </div>
                    </div>

                    {/* Badge đếm số lượng */}
                    <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm text-sm font-bold text-slate-600">
                        Tìm thấy: <span className="text-amber-500">{pagination.totalItems}</span> bộ phim
                    </div>
                </div>

                {/* --- GRID FILMS --- */}
                {movies.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {movies.map((movie) => (
                            <MovieCard key={movie._id} movie={movie} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                        <FiAlertCircle className="text-4xl text-slate-300 mb-3" />
                        <p className="text-slate-500 font-medium">Chưa có phim nào thuộc thể loại này.</p>
                    </div>
                )}

                {/* --- PAGINATION (TÁI SỬ DỤNG) --- */}
                {/* Chỉ hiển thị khi có dữ liệu và > 1 trang */}
                {!loading && movies.length > 0 && (
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default CategoryPage;