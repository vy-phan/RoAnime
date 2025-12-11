import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiArrowLeft, FiCompass } from 'react-icons/fi';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans overflow-hidden relative">
            <div className="absolute top-0 left-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

            <div className="text-center relative z-10 max-w-lg w-full">
                <div className="relative mb-8">
                    {/* Số 404 làm nền mờ */}
                    <h1 className="text-[120px] sm:text-[180px] font-black text-slate-200 leading-none select-none tracking-tighter">
                        404
                    </h1>
                    
                    {/* Ảnh Anime Chibi đè lên số 404 */}
                    {/* Bạn hãy tải 1 ảnh chibi đang khóc hoặc ngơ ngác đặt vào public/404.png nhé */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rotate-12 hover:rotate-0 transition-transform duration-500">
                         {/* Nếu chưa có ảnh, mình dùng thẻ div giả lập, bạn thay thẻ img vào đây */}
                         <img src="/blue-archive-alice.gif" alt="Lost" className="w-40 sm:w-52 h-auto drop-shadow-xl animate-bounce-slow" />
                         
                        
                    </div>
                </div>

                {/* 2. THÔNG BÁO LỖI (Phong cách Anime) */}
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-3">
                    Oops! Lạc vào Hư Vô rồi?
                </h2>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed px-4">
                    Có vẻ như trang bạn tìm kiếm đã bị "Isekai" sang thế giới khác hoặc không tồn tại.
                    Hãy quay lại vùng an toàn thôi!
                </p>

                {/* 3. NÚT ĐIỀU HƯỚNG */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {/* Nút Quay lại */}
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 transition-all flex items-center justify-center gap-2 group"
                    >
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Quay lại
                    </button>

                    {/* Nút Về trang chủ */}
                    <Link 
                        to="/" 
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                        <FiHome />
                        Về Trang Chủ
                    </Link>
                </div>
            </div>
            
            {/* Footer Text nhỏ */}
            <div className="absolute bottom-6 text-slate-400 text-xs font-medium flex items-center gap-2">
                <FiCompass /> Error Code: 404 Not Found
            </div>
        </div>
    );
};

export default NotFoundPage;