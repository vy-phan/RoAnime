import React, { useState } from 'react';

interface ProtectedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    /**
     * Bật/tắt chế độ bảo vệ (mặc định: true)
     * Khi bật sẽ chặn chuột phải và kéo thả ảnh
     */
    protected?: boolean;
}

/**
 * Component ảnh được bảo vệ - chặn chuột phải và kéo thả
 * Tự động hiển thị placeholder khi ảnh lỗi
 * Có thể tái sử dụng ở nhiều nơi trong ứng dụng
 * 
 * @example
 * <ProtectedImage 
 *   src="/path/to/image.jpg" 
 *   alt="Description"
 *   className="w-full"
 * />
 */
const ProtectedImage: React.FC<ProtectedImageProps> = ({ 
    protected: isProtected = true, 
    onContextMenu,
    onDragStart,
    onError,
    src,
    ...props 
}) => {
    const [hasError, setHasError] = useState(false);
    const placeholderImage = '/blue-archive-alice.gif';

    // Reset state khi src thay đổi
    React.useEffect(() => {
        setHasError(false);
    }, [src]);

    // Xử lý khi ảnh bị lỗi
    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setHasError(true);
        onError?.(e);
    };

    // Chặn chuột phải (context menu)
    const handleContextMenu = (e: React.MouseEvent<HTMLImageElement>) => {
        if (isProtected) {
            e.preventDefault();
        }
        onContextMenu?.(e);
    };

    // Chặn kéo thả ảnh
    const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
        if (isProtected) {
            e.preventDefault();
        }
        onDragStart?.(e);
    };

    // Xác định ảnh nào sẽ hiển thị
    // Nếu lỗi hoặc không có src: dùng placeholder
    const imageSrc = hasError || !src ? placeholderImage : src;

    // Tạo style object với các thuộc tính CSS hợp lệ
    const imageStyle: React.CSSProperties & Record<string, any> = {
        ...props.style,
        userSelect: isProtected ? 'none' : props.style?.userSelect,
        WebkitUserSelect: isProtected ? 'none' : props.style?.WebkitUserSelect,
    };

    // Thêm -webkit-user-drag cho trình duyệt WebKit (Safari, Chrome)
    if (isProtected) {
        imageStyle['WebkitUserDrag'] = 'none';
    }

    return (
        <img
            {...props}
            src={imageSrc}
            onError={handleError}
            onContextMenu={handleContextMenu}
            onDragStart={handleDragStart}
            draggable={isProtected ? false : props.draggable}
            style={imageStyle}
        />
    );
};

export default ProtectedImage;

