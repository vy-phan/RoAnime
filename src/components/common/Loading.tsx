import React from 'react';

interface LoadingProps {
  message?: string;     
  className?: string;    
}

const Loading: React.FC<LoadingProps> = ({ 
  message = "Đang tải dữ liệu...", 
  className = "h-[60vh]" 
}) => {
  return (
    // Thêm bg-white để đảm bảo nền trắng khớp với ảnh GIF (nếu GIF không trong suốt)
    // Nếu web bạn dark mode và gif trong suốt thì có thể bỏ bg-white đi
    <div className={`flex flex-col justify-center items-center w-full ${className}`}>
      
      <div className="relative flex justify-center items-center">
        {/* Hiển thị ảnh GIF từ thư mục public */}
        <img 
            src="/loading.gif" 
            alt="Loading..." 
            className=" object-contain" // Tùy chỉnh kích thước ảnh tại đây
        />
      </div>

      <p className="mt-4 text-sm font-bold tracking-wide text-slate-600 animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default Loading;