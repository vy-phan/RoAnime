import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const [pageInput, setPageInput] = useState(currentPage.toString());

    useEffect(() => {
        setPageInput(currentPage.toString());
    }, [currentPage]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val === '' || /^\d+$/.test(val)) {
            setPageInput(val);
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            applyPageChange();
            (e.target as HTMLInputElement).blur();
        }
    };

    const handleBlur = () => {
        applyPageChange();
    };

    const applyPageChange = () => {
        let pageNumber = parseInt(pageInput);
        if (isNaN(pageNumber)) {
            setPageInput(currentPage.toString());
            return;
        }
        if (pageNumber < 1) pageNumber = 1;
        if (pageNumber > totalPages) pageNumber = totalPages;

        if (pageNumber !== currentPage) {
            onPageChange(pageNumber);
        } else {
            setPageInput(currentPage.toString());
        }
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-3 mt-8 select-none">
            {/* --- Nút Trước --- */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-sm hover:border-emerald-400 hover:text-emerald-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 group"
            >
                <FiChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" /> 
                <span className="hidden sm:inline">Trước</span>
            </button>

            {/* --- Input nhập trang (Màu Xanh Lá) --- */}
            <div className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm text-emerald-700 font-bold">
                <span className="text-sm hidden sm:inline">Trang</span>
                
                <input
                    type="text"
                    inputMode="numeric"
                    value={pageInput}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    onBlur={handleBlur}
                    className="w-10 sm:w-12 text-center bg-white text-emerald-700 font-extrabold text-sm rounded-lg py-1 border border-emerald-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all shadow-inner"
                />
                
                <span className="text-sm">/ {totalPages}</span>
            </div>

            {/* --- Nút Sau --- */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-sm hover:border-emerald-400 hover:text-emerald-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 group"
            >
                <span className="hidden sm:inline">Sau</span> 
                <FiChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
        </div>
    );
};

export default Pagination;