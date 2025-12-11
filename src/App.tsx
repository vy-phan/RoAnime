import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import { Suspense } from "react";
import Loading from "./components/common/Loading";
import MovieDetail from "./pages/MovieDetail";
import WatchPage from "./pages/WatchPage";
import CategoryPage from "./pages/CategoryPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
import ScrollToTop from "./components/common/ScrollToTop";
import SearchPage from "./pages/SearchPage";
import Footer from "./components/common/Footer";
import TheatricalPage from "./pages/TheatricalPage";
import HistoryPage from "./pages/HistoryPage";

function App() {

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <BrowserRouter>
        <Navbar />
        <main className="flex-grow pt-20 px-4 container mx-auto">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/phim/:slug" element={<MovieDetail />} />
              <Route path="/phim/:slug/:episodeSlug" element={<WatchPage />} />
              <Route path="/gioi-thieu" element={<AboutPage />} />
              <Route path="/chieu-rap" element={<TheatricalPage />} />
              <Route path="/the-loai/:slug" element={<CategoryPage />} />
              <Route path="/tim-kiem" element={<SearchPage />} />
              <Route path="/lich-su" element={<HistoryPage />} />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <ScrollToTop />
      </BrowserRouter>
    </div>
  )
}

export default App