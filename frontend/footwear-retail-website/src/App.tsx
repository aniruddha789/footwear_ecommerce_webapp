import "./App.css";
import NavBar from "./components/navbar/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import Bottoms from "./Pages/Bottoms/Bottoms";
import Tops from "./Pages/Tops/Tops";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Home from "./Pages/Home/Home";
import Shoes from "./Pages/Shoes/Shoes";
import Accessories from "./Pages/Accessories/Accessories";
import { Container } from "react-bootstrap";
import FilterSortBreadcrumb from "./components/FilterSortBreadcrumb/FilterSortBreadcrumb";
import ProductPage from './Pages/ProductPage/ProductPage';
import PaginatedProductGrid from "./containers/PaginatedProductGrid/PaginatedProductGrid";

function App() {
  return (
    <Router>
      <NavBar />
      <Container>
        <FilterSortBreadcrumb />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:category" element={<PaginatedProductGrid />} />
            <Route path="/:category/:id" element={<ProductPage />} />
          </Routes>
        </div>
      </Container>
    </Router>
  );
}

export default App;
