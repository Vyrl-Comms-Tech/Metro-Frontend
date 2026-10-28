import { useEffect } from 'react'
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import FaqPage from './pages/FaqPage'
import CollectionPage from './pages/CollectionPage'
import ProductPage from './pages/inner-page/ProductPage'
import ContactPage from './pages/ContactPage'
import WishlistPage from './pages/WishlistPage'
import AdminLayout from './admin/AdminLayout'
import Overview from './admin/pages/Overview'
import ProductsAdmin from './admin/pages/ProductsAdmin'
import CategoriesAdmin from './admin/pages/CategoriesAdmin'
import ContentAdmin from './admin/pages/ContentAdmin'
import FaqsAdmin from './admin/pages/FaqsAdmin'
import ReelsAdmin from './admin/pages/ReelsAdmin'
import WishlistProvider from './context/WishlistProvider'
import SiteProvider from './context/SiteProvider'
import './App.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// public site: header + page + footer
function SiteLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <SiteProvider>
      <WishlistProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/collections/:slug" element={<CollectionPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/contact-us" element={<ContactPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/faqs" element={<FaqPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Overview />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="categories" element={<CategoriesAdmin />} />
            <Route path="content" element={<ContentAdmin />} />
            <Route path="faqs" element={<FaqsAdmin />} />
            <Route path="reels" element={<ReelsAdmin />} />
          </Route>
        </Routes>
      </WishlistProvider>
      </SiteProvider>
    </BrowserRouter>
  )
}

export default App
