import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import movieApi from '../api/movieApi';
import MovieCard from '../components/common/MovieCard'; // Import component Card cũ của bạn
import Loading from '../components/common/Loading';
import { FiChevronLeft, FiChevronRight, FiFilter } from 'react-icons/fi';

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

    // Helper: Format tên thể loại từ slug (vd: hanh-dong -> Hành Động)
    const formatTitle = (slug: string | undefined) => {
        if (!slug) return "Danh sách phim";
        return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                // Gọi API với slug và page hiện tại
                const response = await movieApi.getMoviesByCategory(slug, currentPage);
                if (response.status === 'success' || response.data) {
                    setMovies(response.data.items);
                    setPagination(response.data.params.pagination);
                }
            } catch (error) {
                console.error("Lỗi tải danh sách phim:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Scroll lên đầu trang khi chuyển trang
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [slug, currentPage]);

    // Hàm chuyển trang
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setSearchParams({ page: newPage.toString() });
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-white pb-10">
            <div className="container mx-auto px-4 pt-6">
                
                {/* Header Title */}
                <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                        <FiFilter className="text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-800 uppercase">
                            Thể loại: {formatTitle(slug)}
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">
                            Anime Nhật Bản • {pagination.totalItems} kết quả
                        </p>
                    </div>
                </div>

                {/* Grid Films */}
                {movies.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {movies.map((movie) => (
                            <MovieCard key={movie._id} movie={movie} />
                        ))}
                    </div>
                ) : (
                    <div className="h-60 flex items-center justify-center text-gray-500">
                        Không có phim nào thuộc thể loại này.
                    </div>
                )}

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-12">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg border border-gray-200 hover:border-amber-400 hover:text-amber-600 disabled:opacity-50 disabled:cursor-not-allowed bg-white transition-colors flex items-center gap-2 font-bold text-sm"
                        >
                            <FiChevronLeft /> Trang trước
                        </button>

                        <span className="px-4 py-2 bg-amber-50 text-amber-600 font-bold rounded-lg border border-amber-100 text-sm">
                            Trang {currentPage} / {pagination.totalPages}
                        </span>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === pagination.totalPages}
                            className="px-4 py-2 rounded-lg border border-gray-200 hover:border-amber-400 hover:text-amber-600 disabled:opacity-50 disabled:cursor-not-allowed bg-white transition-colors flex items-center gap-2 font-bold text-sm"
                        >
                            Trang sau <FiChevronRight />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;