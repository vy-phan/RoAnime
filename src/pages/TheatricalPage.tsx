import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import movieApi from '../api/movieApi';
import MovieCard from '../components/common/MovieCard';
import Loading from '../components/common/Loading';
import Pagination from '../components/common/Pagination'; // <--- IMPORT COMPONENT MỚI
import { FiFilm, FiAlertCircle } from 'react-icons/fi';

const TheatricalPage: React.FC = () => {
    // 1. Quản lý Params
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    // 2. States
    const [movies, setMovies] = useState<MovieItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalItemsPerPage: 24,
        currentPage: 1,
        totalPages: 1
    });

    // 3. Fetch Data
    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const response = await movieApi.getTheatricalMovies(currentPage, 24);
                
                if (response.status === 'success' || response.data) {
                    setMovies(response.data.items);
                    setPagination(response.data.params.pagination);
                } else {
                    setMovies([]);
                }
            } catch (error) {
                console.error("Lỗi tải phim chiếu rạp:", error);
                setMovies([]);
            } finally {
                setLoading(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        fetchMovies();
    }, [currentPage]);

    // 4. Xử lý chuyển trang (Rất gọn, chỉ cần set URL)
    const handlePageChange = (newPage: number) => {
        setSearchParams({ page: newPage.toString() });
    };

    if (loading) return <Loading message="Đang tải phim chiếu rạp..." />;

    return (
        <div className="min-h-screen bg-slate-50 pt-6 pb-20 font-sans">
            <div className="container mx-auto px-4">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-2xl shadow-lg shadow-rose-500/30 rotate-3">
                            <FiFilm className="text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">
                                Phim Chiếu Rạp
                            </h1>
                            <p className="text-slate-500 font-medium text-sm mt-1">
                                Tuyển tập Anime Movie Nhật Bản mới nhất {new Date().getFullYear()}
                            </p>
                        </div>
                    </div>

                    {/* Badge tổng số lượng */}
                    <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm text-sm font-bold text-slate-600">
                        Tổng số: <span className="text-rose-500">{pagination.totalItems}</span> bộ phim
                    </div>
                </div>

                {/* --- MOVIE GRID --- */}
                {movies.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {movies.map((movie) => (
                            <MovieCard key={movie._id} movie={movie} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                        <FiAlertCircle className="text-4xl text-slate-300 mb-3" />
                        <p className="text-slate-500 font-medium">Chưa có phim chiếu rạp nào được cập nhật.</p>
                    </div>
                )}

                {/* --- SỬ DỤNG PAGINATION COMPONENT --- */}
                <Pagination 
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default TheatricalPage;