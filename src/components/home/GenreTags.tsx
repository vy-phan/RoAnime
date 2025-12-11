import React from 'react';
import { Link } from 'react-router-dom';

// Định nghĩa dữ liệu (Giữ nguyên)
const TAGS = [
    { 
        id: 1, 
        name: "Hành Động", 
        slug: "hanh-dong", 
        image: "/tag/hanh-dong.optimized.webp" 
    },
    { 
        id: 2, 
        name: "Tình Cảm", 
        slug: "tinh-cam", 
        image: "/tag/tinh-cam.optimized.webp" 
    },
    { 
        id: 3, 
        name: "Hài Hước", 
        slug: "hai-huoc", 
        image: "/tag/hai-huoc.optimized.webp" 
    },
    { 
        id: 4, 
        name: "Học Đường", 
        slug: "hoc-duong", 
        image: "/tag/hoc-duong.optimized.webp" 
    },
    { 
        id: 5, 
        name: "Tâm Lý", 
        slug: "tam-ly", 
        image: "/tag/tam-ly.optimized.webp" 
    },
];

const GenreTags: React.FC = () => {
    return (
        <div className="w-full mb-8">
            <div className="flex items-center gap-2 mb-4 px-2">
                <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
                <h2 className="text-lg font-bold text-slate-700 uppercase tracking-wide">
                    Thể Loại Phổ Biến
                </h2>
            </div>

            {/* 
               CONTAINER LAYOUT:
               - Mobile: flex + overflow-x-auto (Lướt ngang)
               - PC (md): grid + grid-cols-5 (Lưới 5 cột)
            */}
            <div className="
                flex gap-3 overflow-x-auto snap-x pb-4 -mx-4 px-4 scrollbar-hide
                md:grid md:grid-cols-5 md:gap-4 md:mx-0 md:px-0 md:overflow-visible md:pb-0
            ">
                {TAGS.map((tag) => (
                    <Link 
                        key={tag.id} 
                        to={`/the-loai/${tag.slug}`}
                        className="
                            group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 transition-all duration-300 cursor-pointer
                            h-24 md:h-28 
                            min-w-[140px] flex-shrink-0 snap-start  /* Mobile: Cố định chiều rộng để không bị co lại */
                            md:min-w-0 md:flex-shrink                               /* PC: Co giãn theo grid */
                        "
                    >
                        {/* 1. Background Image */}
                        <div className="absolute inset-0 w-full h-full">
                            <img 
                                src={tag.image} 
                                alt={tag.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>

                        {/* 2. Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300"></div>

                        {/* 3. Text Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                            <span className="text-white font-black text-sm md:text-base uppercase tracking-wider drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                                {tag.name}
                            </span>
                            <span className="w-0 h-0.5 bg-amber-400 mt-1 transition-all duration-300 group-hover:w-8"></span>
                        </div>

                        {/* 4. Viền Hover */}
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-400/50 rounded-xl transition-colors duration-300 pointer-events-none"></div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default GenreTags;