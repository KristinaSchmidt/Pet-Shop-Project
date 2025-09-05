import { Routes, Route} from "react-router-dom";
import './App.css'
import Header from "./components/header";
import Main from "./pages/main/index";
import Footer from "./components/footer/index";


function App() {


  return (
    <>
     <Header />
     <Routes> 
        <Route path= "/" element= {<Main />} />
        {/*<Route path= "/categories" element= {<Categories />} />
        <Route path= "/products" element= {<Products />} />
        <Route path= "/sales" element= {<Sales />} />*/}
        
      </Routes> 
     <Footer /> 
      
    </>
  )
}

export default App
