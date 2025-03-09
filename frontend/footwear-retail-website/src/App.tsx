import "./App.css";
import NavBar from "./components/navbar/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import { Container } from "react-bootstrap";
import FilterSortBreadcrumb from "./components/FilterSortBreadcrumb/FilterSortBreadcrumb";
import ProductPage from './Pages/ProductPage/ProductPage';
import PaginatedProductGrid from "./containers/PaginatedProductGrid/PaginatedProductGrid";
import { CartProvider } from './context/CartContext';
import CartPage from './Pages/Cart/CartPage';
import CheckoutPage from './Pages/Checkout/CheckoutPage';
import OrderSuccessPage from './Pages/OrderSuccess/OrderSuccessPage';
import SearchResults from './Pages/SearchResults/SearchResults';
import MobileNavBar from './components/MobileNavBar/MobileNavBar';
import CategoriesPage from './Pages/Categories/CategoriesPage';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import ProfilePage from './Pages/Profile/ProfilePage';

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div className="app-wrapper">
          <NavBar />
          <Container className="main-container">
            <FilterSortBreadcrumb />
            <div className="content-container">
              <Routes>
                <Route path="/search" element={<SearchResults />} />
                <Route path="/:category/:id" element={<ProductPage />} />
                <Route path="/:category" element={<PaginatedProductGrid />} />
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </div>
          </Container>
          <Footer />
          <MobileNavBar />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
