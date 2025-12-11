import React, { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';

const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Logic: Kiểm tra vị trí cuộn để hiện/ẩn nút
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        // Cleanup function khi component unmount
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    // Logic: Cuộn mượt lên đầu trang
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            type="button"
            onClick={scrollToTop}
            className={`
                fixed bottom-8 right-6 z-50 
                transition-all duration-500 ease-in-out transform
                ${isVisible
                    ? 'opacity-100 translate-y-0 visible'
                    : 'opacity-0 translate-y-10 invisible'}
                group
            `}
            aria-label="Lên đầu trang"
        >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                {/* Hiệu ứng hào quang phía sau */}
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>

                {/* Container chứa ảnh và mũi tên */}
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/80 shadow-xl group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">

                    {/* Ảnh nền */}
                    <img
                        src="/scrollerToTop.jpg"
                        alt="Go to top"
                        className="w-full h-full object-cover"
                    />

                    {/* 
                       Lớp phủ chứa Mũi tên:
                       - bg-black/20: Nền đen mờ nhẹ để mũi tên trắng nổi bật hơn trên ảnh sáng.
                       - group-hover:bg-black/40: Tối hơn chút khi hover.
                    */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors duration-300">
                        <FiArrowUp
                            className="text-white text-xl sm:text-2xl font-bold drop-shadow-md group-hover:-translate-y-1 transition-transform duration-300"
                        />
                    </div>

                </div>
            </div>
        </button>
    );
};

export default ScrollToTop;