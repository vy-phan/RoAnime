interface Category {
    id: string;
    name: string;
    slug: string;
}

interface TMDB {
    type: string;
    id: string;
    season?: number;
    vote_average: number;
    vote_count: number;
}

interface Episode {
    name: string;
    slug: string;
    filename: string;
    link_embed: string;
    link_m3u8: string;
}

interface Server {
    server_name: string;
    server_data: Episode[];
}

interface MovieItem {
    _id: string;
    name: string;
    slug: string;
    origin_name: string;
    thumb_url: string;
    poster_url: string;
    content?: string;
    year: number;
    time?: string;
    episode_current?: string;
    quality?: string;
    lang?: string;
    category?: Category[];
    tmdb?: TMDB;
}

interface MovieDetail extends MovieItem {
    status: string;
    is_copyright: boolean;
    sub_docquyen: boolean;
    chieurap: boolean;
    trailer_url: string;
    episode_total: string;
    notify: string;
    showtimes: string;
    view: number;
    actor: string[];
    director: string[];
    country: Country[];
    episodes: Server[];
}

interface MovieListResponse {
    status: string;
    data: {
        items: MovieItem[];
        params: {
            pagination: {
                totalItems: number;
                totalItemsPerPage: number;
                currentPage: number;
                totalPages: number;
            };
        };
    };
}

interface MovieDetailResponse {
    status: boolean;
    msg: string;
    movie: MovieDetail;
    episodes: Server[];
}