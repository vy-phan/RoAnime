import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiMenu, FiX, FiChevronDown, FiClock, FiGrid, FiHome, FiInfo, FiArrowRight } from 'react-icons/fi';
import movieApi from '../../api/movieApi';
import { getPosterUrl } from '../../utils/image';
import { decodeHTMLEntities } from '../../utils/textFomat';

// Định nghĩa lại Type để tránh lỗi TS nếu cần (giả sử MovieItem đã có global)
// interface MovieItem { ... } 

const CATEGORIES = [
    { name: "Hành Động", slug: "hanh-dong" },
    { name: "Chiến Tranh", slug: "chien-tranh" },
    { name: "Viễn Tưởng", slug: "vien-tuong" },
    { name: "Kinh Dị", slug: "kinh-di" },
    { name: "Tài Liệu", slug: "tai-lieu" },
    { name: "Bí Ẩn", slug: "bi-an" },
    { name: "Tình Cảm", slug: "tinh-cam" },
    { name: "Tâm Lý", slug: "tam-ly" },
    { name: "Thể Thao", slug: "the-thao" },
    { name: "Phiêu Lưu", slug: "phieu-luu" },
    { name: "Âm Nhạc", slug: "am-nhac" },
    { name: "Gia Đình", slug: "gia-dinh" },
    { name: "Học Đường", slug: "hoc-duong" },
    { name: "Hài Hước", slug: "hai-huoc" },
    { name: "Hình Sự", slug: "hinh-su" },
    { name: "Võ Thuật", slug: "vo-thuat" },
    { name: "Khoa Học", slug: "khoa-hoc" },
    { name: "Thần Thoại", slug: "than-thoai" },
    { name: "Chính Kịch", slug: "chinh-kich" },
    { name: "Kinh Điển", slug: "kinh-dien" },
];

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    // FIX 1: Khởi tạo state luôn là mảng rỗng
    const [suggestedMovies, setSuggestedMovies] = useState<MovieItem[]>([]); 
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLiveSearching, setIsLiveSearching] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [isInputFocused, setIsInputFocused] = useState(false);

    // Hiệu ứng Scroll
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Phím tắt Ctrl K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            // Thêm class này hoặc set style trực tiếp để khóa cuộn trang chính
            document.body.style.overflow = 'hidden';
            
            // (Tùy chọn) Nếu trên iOS Safari vẫn bị cuộn, bạn có thể cần thêm:
            // document.body.style.position = 'fixed';
            // document.body.style.width = '100%';
        } else {
            document.body.style.overflow = 'unset';
            
            // (Tùy chọn) Reset lại fix cho iOS
            // document.body.style.position = '';
            // document.body.style.width = '';
        }

        return () => {
            document.body.style.overflow = 'unset';
            // document.body.style.position = '';
            // document.body.style.width = '';
        };
    }, [isMobileMenuOpen]);

    // Click outside để đóng dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Đóng menu khi chuyển trang
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setShowSuggestions(false);
    }, [location]);

    // --- LOGIC SEARCH (ĐÃ FIX LỖI NULL) ---
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            // Kiểm tra an toàn cho searchTerm
            if (searchTerm && searchTerm.trim().length > 1) { 
                setIsLiveSearching(true);
                setShowSuggestions(true);
                try {
                    const response = await movieApi.searchMovies(searchTerm, 1, 6);
                    
                    // FIX 2: Kiểm tra kỹ data trước khi set state
                    // Sử dụng Optional Chaining (?.) và fallback về mảng rỗng []
                    if (response?.data?.items && Array.isArray(response.data.items)) {
                        setSuggestedMovies(response.data.items);
                    } else {
                        setSuggestedMovies([]);
                    }
                } catch (error) {
                    console.error("Lỗi live search:", error);
                    setSuggestedMovies([]); // Luôn reset về mảng rỗng khi lỗi
                } finally {
                    setIsLiveSearching(false);
                }
            } else {
                setSuggestedMovies([]);
                setShowSuggestions(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm && searchTerm.trim()) {
            setShowSuggestions(false);
            navigate(`/tim-kiem?keyword=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <header
            className={`
                fixed top-0 w-full z-50 transition-all duration-300 ease-in-out font-sans
                ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/50' : 'bg-white border-b border-transparent py-2'}
            `}
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

                {/* --- 1. LOGO --- */}
                <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
                    <img
                        src="/logoRoAnime.png"
                        alt="Rổ Anime"
                        className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="text-xl font-black tracking-tighter text-slate-800">
                        Rổ<span className="text-amber-500">Anime</span>
                    </span>
                </Link>

                {/* --- 2. DESKTOP NAVIGATION --- */}
                <nav className="hidden lg:flex items-center gap-1">
                    <NavLink to="/" icon={<FiHome />} label="Trang chủ" active={location.pathname === '/'} />

                    {/* DROPDOWN THỂ LOẠI */}
                    <div className="group relative px-3 py-2">
                        <button className={`
                            flex items-center gap-1.5 text-sm font-bold transition-colors
                            ${location.pathname.includes('/the-loai') ? 'text-amber-600' : 'text-slate-600 group-hover:text-amber-600'}
                        `}>
                            <FiGrid className="text-lg" />
                            Thể loại
                            <FiChevronDown className="text-xs transition-transform group-hover:rotate-180" />
                        </button>

                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 w-[600px]">
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -z-10"></div>
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
                                    Khám phá theo thể loại
                                </h3>
                                <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                                    {CATEGORIES.map((cat) => (
                                        <Link
                                            key={cat.slug}
                                            to={`/the-loai/${cat.slug}`}
                                            className="text-sm font-medium text-slate-600 hover:text-amber-600 hover:bg-amber-50 px-3 py-2 rounded-lg transition-colors flex items-center justify-between group/item"
                                        >
                                            {cat.name}
                                            <span className="opacity-0 group-hover/item:opacity-100 text-amber-400 text-xs transition-opacity">→</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <NavLink to="/chieu-rap" icon={<FiInfo />} label="Phim chiếu rạp" active={location.pathname === '/chieu-rap'} />
                    <NavLink to="/lich-su" icon={<FiClock />} label="Lịch sử" active={location.pathname === '/lich-su'} />
                    <NavLink to="/gioi-thieu" icon={<FiInfo />} label="Giới thiệu" active={location.pathname === '/gioi-thieu'} />
                </nav>

                {/* --- 3. SEARCH BAR --- */}
                <div className="flex items-center gap-3 flex-1 lg:flex-none justify-end">
                    <div
                        ref={searchRef}
                        className={`
                            hidden sm:block relative group transition-all duration-300 ease-in-out
                            ${isInputFocused || searchTerm ? 'w-[320px] lg:w-[400px]' : 'w-[240px] lg:w-[280px]'} 
                        `}
                    >
                        <form onSubmit={handleSearch} className="relative z-20">
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Tìm kiếm anime..."
                                className={`
                                    w-full bg-slate-100 text-slate-700 text-sm font-medium py-2.5 pl-10 pr-12 outline-none border border-transparent 
                                    focus:bg-white focus:border-amber-300 focus:ring-4 focus:ring-amber-100 
                                    transition-all placeholder:text-slate-400
                                    ${showSuggestions ? 'rounded-t-2xl rounded-b-none shadow-lg bg-white' : 'rounded-full'}
                                `}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => {
                                    setIsInputFocused(true);
                                    // FIX 3: Thêm ?.length để tránh crash nếu suggestedMovies lỡ bị null
                                    if (searchTerm.trim().length > 1 && suggestedMovies?.length > 0) setShowSuggestions(true);
                                }}
                                onBlur={() => {
                                    setTimeout(() => setIsInputFocused(false), 200);
                                }}
                            />

                            <button type="submit" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors text-lg">
                                {isLiveSearching ? (
                                    <div className="w-4 h-4 border-2 border-slate-300 border-t-amber-500 rounded-full animate-spin"></div>
                                ) : (
                                    <FiSearch />
                                )}
                            </button>

                            {!isInputFocused && !searchTerm && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">
                                        Ctrl K
                                    </span>
                                </div>
                            )}

                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm('');
                                        searchInputRef.current?.focus();
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors"
                                >
                                    <FiX size={14} />
                                </button>
                            )}
                        </form>

                        {/* --- DROPDOWN SUGGESTIONS --- */}
                        {showSuggestions && (
                            <div className="absolute top-full left-0 w-full bg-white rounded-b-2xl shadow-xl border-x border-b border-slate-100 overflow-hidden z-10 animate-fade-in-down">
                                {/* FIX 4: Thêm ?.length và fallback || [] để render an toàn */}
                                {suggestedMovies && suggestedMovies.length > 0 ? (
                                    <div className="py-2">
                                        <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            Gợi ý hàng đầu
                                        </div>

                                        {suggestedMovies.slice(0, 5).map((movie) => (
                                            <Link
                                                key={movie._id}
                                                to={`/phim/${movie.slug}`}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors group/item"
                                                onClick={() => setShowSuggestions(false)}
                                            >
                                                <div className="w-10 h-14 flex-shrink-0 rounded-md overflow-hidden bg-slate-200">
                                                    <img
                                                        src={getPosterUrl(movie.thumb_url)}
                                                        alt={movie.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-slate-700 truncate group-hover/item:text-amber-600 transition-colors">
                                                        {decodeHTMLEntities(movie.name)}
                                                    </h4>
                                                    <p className="text-xs text-slate-500 truncate mt-0.5">
                                                        {decodeHTMLEntities(movie.origin_name)}
                                                    </p>
                                                    <span className="text-[10px] text-slate-400 font-medium">
                                                        {movie.year} • {movie.time || 'N/A'}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}

                                        {suggestedMovies.length > 5 && (
                                            <button
                                                onClick={handleSearch}
                                                className="w-full text-center py-3 text-xs font-bold text-amber-600 hover:bg-amber-50 hover:underline flex items-center justify-center gap-1 border-t border-slate-100"
                                            >
                                                Xem tất cả kết quả <FiArrowRight />
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    !isLiveSearching && (
                                        <div className="p-6 text-center text-slate-500">
                                            <p className="text-sm">Không tìm thấy phim phù hợp.</p>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Search & Menu Toggle */}
                    <button className="sm:hidden p-2 text-slate-600 hover:text-amber-600 transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
                        <FiSearch className="text-xl" />
                    </button>
                    <button className="lg:hidden p-2 text-slate-800 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
                    </button>
                </div>
            </div>

            {/* --- MOBILE MENU OVERLAY --- */}
            <div className={`
                lg:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-xl transition-all duration-300
                ${isMobileMenuOpen ? 'opacity-100 visible top-16' : 'opacity-0 invisible top-20 pointer-events-none'}
            `}>
                <div className="container mx-auto px-4 py-6 flex flex-col h-full overflow-y-auto pb-20 overscroll-contain">
                    <form onSubmit={handleSearch} className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="w-full bg-slate-100 p-4 rounded-xl text-slate-800 font-bold outline-none focus:ring-2 focus:ring-amber-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                            <FiSearch className="text-xl" />
                        </button>
                    </form>

                    <div className="flex flex-col gap-2">
                        <MobileNavLink to="/" label="Trang chủ" icon={<FiHome />} onClick={() => setIsMobileMenuOpen(false)} />
                        <div className="py-2">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-4">Thể loại</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {CATEGORIES.map(cat => (
                                    <Link
                                        key={cat.slug}
                                        to={`/the-loai/${cat.slug}`}
                                        className="text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-lg hover:bg-amber-100 hover:text-amber-700 transition-colors text-center"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <MobileNavLink to="/chieu-rap" label="Phim chiếu rạp" icon={<FiInfo />} onClick={() => setIsMobileMenuOpen(false)} />
                        <MobileNavLink to="/lich-su" label="Lịch sử xem" icon={<FiClock />} onClick={() => setIsMobileMenuOpen(false)} />
                        <MobileNavLink to="/gioi-thieu" label="Giới thiệu" icon={<FiInfo />} onClick={() => setIsMobileMenuOpen(false)} />
                    </div>
                </div>
            </div>
        </header>
    );
};

const NavLink = ({ to, label, icon, active }: { to: string, label: string, icon: React.ReactNode, active: boolean }) => (
    <Link
        to={to}
        className={`
            px-3 py-2 rounded-lg flex items-center gap-1.5 text-sm font-bold transition-all
            ${active ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:text-amber-600 hover:bg-slate-50'}
        `}
    >
        <span className="text-lg">{icon}</span>
        {label}
    </Link>
);

const MobileNavLink = ({ to, label, icon, onClick }: { to: string, label: string, icon: React.ReactNode, onClick: () => void }) => (
    <Link
        to={to}
        onClick={onClick}
        className="flex items-center gap-4 p-4 rounded-xl text-slate-700 font-bold hover:bg-slate-50 active:bg-slate-100 transition-colors text-lg"
    >
        <span className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xl">
            {icon}
        </span>
        {label}
    </Link>
);

export default Navbar;