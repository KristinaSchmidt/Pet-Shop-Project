import { Routes, Route} from "react-router-dom";
import './App.css'
import Header from "./components/header";
import Main from "./pages/main/index";
import Footer from "./components/footer/index";
import Categories from "./pages/categories/index";
import Sales from "./pages/sales/index";


function App() {
  

  return (
    <>
     <Header />
     
     <Routes> 
        <Route path= "/" element= {<Main /> } />
        <Route path="/categories" element={<Categories />} />
        {/*<Route path= "/products" element= {<Products />} />*/}
        <Route path= "/sales" element= {<Sales />} />
        <Route path="*" element={<h1 style={{padding:24}}>404 Page Not Found</h1>} />
      </Routes> 
     <Footer /> 
      
    </>
  )
}

export default App
