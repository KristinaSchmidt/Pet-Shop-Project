import { Routes, Route} from "react-router-dom";
import './App.css'
import Header from "./components/header";
import Main from "./pages/main/index";
import Footer from "./components/footer/index";
import Categories from "./pages/categories/index";
import Sales from "./pages/sales/index";
import CategoryPage from "./pages/category/index";
import AllProductsPage from "./pages/products/index";
import ProductPage from "./pages/product/index";
import NotFoundPage from "./pages/NotFoundPage/index/";
import BasketPage from "./pages/basket/index";


function App() {
  

  return (
    <>
     <Header />
     
     <Routes> 
        <Route path= "/" element= {<Main /> } />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:id" element={<CategoryPage />} />
        <Route path= "/products" element= {<AllProductsPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path= "/sales" element= {<Sales />} />
        <Route path="/cart" element={<BasketPage />} />
        <Route path="/not-found" element={<NotFoundPage />} />
      </Routes> 
     <Footer /> 
      
    </>
  )
}

export default App
