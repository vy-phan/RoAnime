import apiClient from "./apiClients";


const movieApi = {
    // Lấy danh sách Anime Nhật Bản
    getAnimeJapan: (page: number = 1, limit: number = 24): Promise<MovieListResponse> => {
        return apiClient.get('/v1/api/danh-sach/hoat-hinh', {
            params: {
                country: 'nhat-ban',
                page: page,
                sort_field: 'year',
                limit: limit
            }
        });
    },

    //  Lấy danh sách để tính Ranking 
    getRankingList: (year: number, limit: number = 50): Promise<MovieListResponse> => {
        return apiClient.get('/v1/api/danh-sach/hoat-hinh', {
            params: {
                country: 'nhat-ban',
                year: year,
                limit: limit,
                sort_field: 'view',
                sort_type: 'desc'
            }
        });
    },

    getTrendingAnimeMovies: (pageNumber: number, limit:number): Promise<MovieListResponse> => {
        const currentYear = new Date().getFullYear();

        return apiClient.get('/v1/api/danh-sach/phim-chieu-rap', {
            params: {
                country: 'nhat-ban',
                page: pageNumber,
                year: currentYear,
                sort_field: 'modified.time',
                sort_type: 'desc',
                limit: limit
            }
        });
    },

     getTheatricalMovies: (pageNumber: number = 1, limit: number = 24): Promise<MovieListResponse> => {
        return apiClient.get('/v1/api/danh-sach/phim-chieu-rap', {
            params: {
                country: 'nhat-ban',
                page: pageNumber,
                sort_field: 'modified.time',
                sort_type: 'desc',
                limit: limit
            }
        });
    },

    searchMovies: (keyword: string, page: number = 1, limit: number = 24): Promise<MovieListResponse> => {
        return apiClient.get('/v1/api/tim-kiem', {
            params: {
                keyword: keyword,
                page: page,
                limit: limit,
                sort_field: 'modified.time',
                sort_type: 'desc',
                country: 'nhat-ban'
            }
        });
    },

    getMoviesByCategory: (slug: string, page: number = 1, limit: number = 24): Promise<MovieListResponse> => {
        return apiClient.get('/v1/api/danh-sach/hoat-hinh', {
            params: {
                category: slug,              // Lọc thể loại (VD: hoc-duong, hanh-dong...)
                country: 'nhat-ban',         // Lọc Nhật Bản
                sort_field: 'year', // Sắp xếp theo thời gian cập nhật mới nhất
                sort_type: 'desc',
                page: page,
                limit: limit
            }
        });
    },

    // Lấy danh sách phim mới cập nhật 
    getNewUpdated: (page: number = 1): Promise<MovieListResponse> => {
        return apiClient.get('/danh-sach/phim-moi-cap-nhat', {
            params: { page }
        });
    },

    // Lấy chi tiết phim 
    getMovieDetail: (slug: string): Promise<MovieDetailResponse> => {
        return apiClient.get(`/phim/${slug}`);
    }
};

export default movieApi;