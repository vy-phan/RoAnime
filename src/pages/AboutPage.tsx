import React, { useEffect } from 'react';
import { FiCode, FiDatabase, FiHeart, FiLayers, FiCpu, FiCheckCircle } from 'react-icons/fi';

const AboutPage: React.FC = () => {
    
    // Scroll lên đầu trang khi vào
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pt-10 pb-20 font-sans">
            <div className="container mx-auto px-4 max-w-4xl">
                
                {/* 1. HERO HEADER */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-block p-3 bg-white rounded-2xl shadow-sm border border-slate-100 mb-2">
                        <img src="/logoRoAnime.png" alt="Rổ Anime" className="h-20 w-auto object-contain" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">
                        Về Dự Án <span className="text-amber-500">Rổ Anime</span>
                    </h1>
                    <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                        Nơi thỏa mãn đam mê Anime với giao diện hiện đại và trải nghiệm mượt mà.
                    </p>
                </div>

                {/* 2. MAIN CONTENT CARDS */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    
                    {/* Card: Mục đích */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                            <FiCode />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-3">Mục Đích Học Tập</h2>
                        <p className="text-slate-600 leading-relaxed text-justify">
                            Đây là một dự án <strong>Frontend thuần túy (Pure Frontend)</strong> được xây dựng nhằm mục đích nghiên cứu và thực hành các công nghệ web hiện đại. Website tập trung tối ưu hóa giao diện người dùng (UI/UX), khả năng tương thích trên các thiết bị và tốc độ tải trang.
                        </p>
                    </div>

                    {/* Card: Công nghệ */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                            <FiCpu />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-3">Công Nghệ Sử Dụng</h2>
                        <ul className="space-y-3">
                            {[
                                "ReactJS & TypeScript",
                                "Tailwind CSS v3",
                                "React Router Dom v6",
                                "Axios & RESTful API",
                                "Responsive Design (Mobile First)"
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-slate-600">
                                    <FiCheckCircle className="text-green-500 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 3. NGUỒN DỮ LIỆU (CREDIT) */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-12 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                        <FiDatabase />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Nguồn Dữ Liệu API</h2>
                        <p className="text-slate-600 mb-4">
                            Dự án sử dụng nguồn tài nguyên API công khai và miễn phí được cung cấp bởi <strong>KKPhim (PhimApi)</strong>. 
                            Xin chân thành cảm ơn đội ngũ phát triển KKPhim đã chia sẻ kho dữ liệu phim khổng lồ giúp cộng đồng lập trình viên có cơ hội thực hành.
                        </p>
                        <a 
                            href="https://phimapi.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-amber-400 hover:text-white transition-colors"
                        >
                            <FiLayers /> Ghé thăm KKPhim
                        </a>
                    </div>
                </div>

                {/* 4. THANK YOU CARD */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 text-center text-white shadow-xl relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                    
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 text-amber-400 text-2xl animate-pulse">
                            <FiHeart className="fill-current" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black mb-4">Cảm Ơn Bạn Đã Ghé Thăm!</h2>
                        <p className="text-slate-300 max-w-xl mx-auto leading-relaxed mb-8">
                            Hy vọng <strong>Rổ Anime</strong> mang lại cho bạn những trải nghiệm thú vị. 
                            Vì là dự án cá nhân nhằm mục đích học tập nên không thể tránh khỏi những thiếu sót. 
                            Mọi đóng góp và sự ủng hộ của các bạn là động lực rất lớn.
                        </p>
                        <div className="text-sm font-medium text-slate-400">
                            © {new Date().getFullYear()} Developed with ❤️ by Arya Kujou
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutPage;