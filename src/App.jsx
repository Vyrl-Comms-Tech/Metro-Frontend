import { useEffect, useRef } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import FaqPage from './pages/FaqPage'
import CollectionPage from './pages/CollectionPage'
import CollectionRoute from './pages/CollectionRoute'
import ProductPage from './pages/inner-page/ProductPage'
import SearchPage from './pages/SearchPage'
import StonePage from './pages/StonePage'
import CustomJewelleryPage from './pages/CustomJewelleryPage'
import ContactPage from './pages/ContactPage'
import WishlistPage from './pages/WishlistPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import AdminLayout from './admin/AdminLayout'
import LoginPage from './admin/LoginPage'
import ProtectedRoute from './admin/ProtectedRoute'
import AuthProvider from './context/AuthProvider'
import Overview from './admin/pages/Overview'
import ProductsAdmin from './admin/pages/ProductsAdmin'
import CategoriesAdmin from './admin/pages/CategoriesAdmin'
// import ContentAdmin from './admin/pages/ContentAdmin' // Website Content tab switched off
import FaqsAdmin from './admin/pages/FaqsAdmin'
import ReelsAdmin from './admin/pages/ReelsAdmin'
import CustomJewelleryAdmin from './admin/pages/CustomJewelleryAdmin'
import EnquiriesAdmin from './admin/pages/EnquiriesAdmin'
import WishlistProvider from './context/WishlistProvider'
import SiteProvider from './context/SiteProvider'
import './App.css'

// new page -> top; a #section link then glides to its section once the page has rendered
function ScrollToTop() {
  const { pathname, hash, key } = useLocation()
  const lastPath = useRef(null)

  useEffect(() => {
    const newPage = lastPath.current !== pathname
    lastPath.current = pathname
    if (newPage) window.scrollTo(0, 0)
    if (!hash) return

    // the section may not exist yet (FAQs load from the API), so wait for it
    let tries = 0
    let glide
    const poll = setInterval(() => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (!el && ++tries < 40) return
      clearInterval(poll)
      if (el) glide = setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), newPage ? 300 : 0)
    }, 100)

    return () => {
      clearInterval(poll)
      clearTimeout(glide)
    }
  }, [pathname, hash, key])

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
      <AuthProvider>
      <SiteProvider>
      <WishlistProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<HomePage />} />
            {/* the stones have pages of their own, older links to their collection go there */}
            <Route path="/collections/gemstones" element={<Navigate to="/gemstone" replace />} />
            <Route path="/collections/gemstone" element={<Navigate to="/gemstone" replace />} />
            <Route path="/collections/:slug" element={<CollectionPage />} />
            <Route path="/collections/:slug/:option" element={<CollectionRoute />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/gemstone" element={<StonePage page="gemstone" />} />
            <Route path="/loose-diamond" element={<StonePage page="loose-diamond" />} />
            <Route path="/diamonds" element={<StonePage page="diamonds" />} />
            <Route path="/custom-jewellery" element={<CustomJewelleryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/contact-us" element={<ContactPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/faqs" element={<FaqPage />} />
            <Route path="/terms-conditions" element={<TermsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>

          <Route path="/admin/login" element={<LoginPage />} />

          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Overview />} />
              <Route path="products" element={<ProductsAdmin />} />
              <Route path="categories" element={<CategoriesAdmin />} />
              {/* <Route path="content" element={<ContentAdmin />} /> */}
              <Route path="faqs" element={<FaqsAdmin />} />
              <Route path="custom-jewellery" element={<CustomJewelleryAdmin />} />
              <Route path="reels" element={<ReelsAdmin />} />
              <Route path="enquiries" element={<EnquiriesAdmin />} />
            </Route>
          </Route>
        </Routes>
      </WishlistProvider>
      </SiteProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
