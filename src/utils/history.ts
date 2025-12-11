export interface HistoryItem {
    movieSlug: string;
    movieName: string;
    thumbUrl: string;
    lastEpisode: {          
        slug: string;
        name: string;
    };
    watchedEpisodes: string[]; 
    updatedAt: number;  
}

export interface HistoryList extends HistoryItem {}

const HISTORY_KEY = 'anime_watch_history';

export const addToHistory = (movie: any, episode: any) => {
    try {
        // 1. Lấy dữ liệu cũ
        const raw = localStorage.getItem(HISTORY_KEY);
        let history: Record<string, HistoryItem> = raw ? JSON.parse(raw) : {};

        // 2. Kiểm tra xem phim này đã có trong lịch sử chưa
        const existingItem = history[movie.slug];

        // 3. Xử lý danh sách tập đã xem (Set để tránh trùng lặp)
        let watchedSet = new Set<string>(existingItem ? existingItem.watchedEpisodes : []);
        watchedSet.add(episode.slug);

        // 4. Tạo object mới
        const newItem: HistoryItem = {
            movieSlug: movie.slug,
            movieName: movie.name,
            thumbUrl: movie.thumb_url,
            lastEpisode: {
                slug: episode.slug,
                name: episode.name
            },
            watchedEpisodes: Array.from(watchedSet), // Chuyển Set về Array
            updatedAt: Date.now()
        };

        // 5. Lưu lại vào object tổng
        history[movie.slug] = newItem;

        // 6. Lưu xuống LocalStorage
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        
        return newItem;
    } catch (error) {
        console.error("Lỗi lưu lịch sử:", error);
        return null;
    }
};

export const getMovieHistory = (slug: string): HistoryItem | null => {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        if (!raw) return null;
        const history = JSON.parse(raw);
        return history[slug] || null;
    } catch {
        return null;
    }
};

export const getAllHistory = (): HistoryItem[] => {
    try {
        const raw = localStorage.getItem('anime_watch_history');
        if (!raw) return [];
        
        const historyMap = JSON.parse(raw);
        
        // Chuyển object thành array values
        const historyList: HistoryItem[] = Object.values(historyMap);

        // Sắp xếp: Thời gian cập nhật giảm dần (Mới xem thì lên đầu)
        return historyList.sort((a, b) => b.updatedAt - a.updatedAt);
    } catch {
        return [];
    }
};

export const removeHistoryItem = (slug: string) => {
    try {
        const raw = localStorage.getItem('anime_watch_history');
        if (!raw) return;

        const historyMap = JSON.parse(raw);
        delete historyMap[slug];

        // Lưu lại
        localStorage.setItem('anime_watch_history', JSON.stringify(historyMap));
        
        return Object.values(historyMap).sort((a:any, b:any) => b.updatedAt - a.updatedAt);
    } catch (error) {
        console.error("Lỗi xóa lịch sử:", error);
    }
};

export const clearAllHistory = () => {
    localStorage.removeItem('anime_watch_history');
};