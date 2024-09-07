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

function App() {
  return (
    <Router>
      <NavBar />
      <Container>
        <FilterSortBreadcrumb />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tops" element={<Tops />} />
            <Route path="/bottoms" element={<Bottoms />} />
            <Route path="/shoes" element={<Shoes />} />
            <Route path="/accessories" element={<Accessories />} />
            <Route path="/product/:id" element={<ProductPage />} />
          </Routes>
        </div>
      </Container>
    </Router>
  );
}

export default App;
