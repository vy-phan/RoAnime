import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiArrowRight, FiBookOpen, FiExternalLink } from 'react-icons/fi';

const Footer: React.FC = () => {
  // Lấy năm hiện tại tự động
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 font-sans">
      <div className="container mx-auto px-4">

        {/* --- MAIN FOOTER CONTENT --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* COL 1: BRAND & INFO */}
          <div className="space-y-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <img
                src="/logoRoAnime.png"
                alt="Rổ Anime"
                className="h-10 w-auto object-contain"
              />
              <span className="text-xl font-black tracking-tighter text-slate-800">
                Rổ<span className="text-amber-500">Anime</span>
              </span>
            </Link>

            <p className="text-slate-500 text-sm leading-relaxed text-justify">
              Website xem Anime Vietsub trực tuyến miễn phí với giao diện hiện đại, tốc độ cao . Nơi thỏa mãn đam mê của mọi Wibu chân chính.
            </p>


          </div>

          {/* COL 2: KHÁM PHÁ (Sitemap) */}
          <div>
            <h3 className="font-bold text-slate-800 text-lg mb-6 border-l-4 border-amber-500 pl-3">
              Khám Phá
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Trang chủ", link: "/" },
                { name: "Phim Chiếu Rạp", link: "/chieu-rap" },
                { name: "Lịch sử xem", link: "/lich-su" },
                { name: "Tìm kiếm nâng cao", link: "/tim-kiem" },
                { name: "Giới thiệu", link: "/gioi-thieu" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.link}
                    className="text-slate-500 text-sm font-medium hover:text-amber-600 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                  >
                    <FiArrowRight size={12} className="opacity-50" /> {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 3: THỂ LOẠI HOT */}
          <div>
            <h3 className="font-bold text-slate-800 text-lg mb-6 border-l-4 border-amber-500 pl-3">
              Thể Loại Hot
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Hành Động", slug: "hanh-dong" },
                { name: "Tình Cảm", slug: "tinh-cam" },
                { name: "Viễn Tưởng", slug: "vien-tuong" },
                { name: "Học Đường", slug: "hoc-duong" },
                { name: "Hài Hước", slug: "hai-huoc" },
                { name: "Âm nhạc", slug: "am-nhac" },
              ].map((cat, idx) => (
                <Link
                  key={idx}
                  to={`/the-loai/${cat.slug}`}
                  className="text-slate-500 text-sm hover:text-amber-600 hover:bg-slate-50 p-2 rounded transition-colors truncate"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* COL 4: ĐỐI TÁC (Liên kết NTR Manga) */}
          <div className="col-span-1"> {/* Đảm bảo nằm trong grid column của footer */}
            <h3 className="font-bold text-slate-800 text-lg mb-6 border-l-4 border-amber-500 pl-3">
              Hệ Sinh Thái
            </h3>

            {/* Card Link Manga - Tông Hồng Tươi Sáng */}
            <a
              href="https://ntrmanga.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {/* Decor: Vòng tròn mờ phía sau */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8 blur-xl"></div>

              <div className="flex items-start justify-between mb-3 relative z-10">
                {/* Icon Box: Nền trắng mờ, icon trắng */}
                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl text-white border border-white/20">
                  <FiBookOpen size={24} />
                </div>
                <FiExternalLink className="text-pink-100 group-hover:text-white transition-colors" />
              </div>

              <h4 className="font-black text-lg text-white group-hover:text-yellow-200 transition-colors relative z-10">
                NTR Manga
              </h4>
              <p className="text-xs text-pink-50 mt-1 italic font-medium opacity-90 relative z-10">
                "Anh em cùng cha khác ông nội của Dev Coder"
              </p>

              {/* Badge: Nền trắng, chữ hồng */}
              <div className="mt-4 text-[10px] font-bold uppercase tracking-widest text-pink-600 bg-white inline-block px-3 py-1.5 rounded-lg shadow-sm relative z-10 group-hover:scale-105 transition-transform origin-left">
                Đọc Truyện Tranh
              </div>
            </a>
          </div>
        </div>

        {/* --- COPYRIGHT BAR --- */}
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm font-medium text-center md:text-left">
            © {currentYear} <strong>Rổ Anime</strong>. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
            Made with <FiHeart className="text-red-500 fill-current animate-pulse" /> by
            <span className="text-slate-800 font-bold hover:text-amber-500 cursor-pointer transition-colors">
              Arya Kujou
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;