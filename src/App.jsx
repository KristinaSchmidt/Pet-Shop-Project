import { Routes, Route} from "react-router-dom";
import './App.css'

function App() {


  return (
    <>
     <Header />
     <Routes> 
        <Route path= "/" element= {<Main />} />
        <Route path= "/categories" element= {<Categories />} />
        <Route path= "/products" element= {<Products />} />
        <Route path= "/sales" element= {<Sales />} />
        
      </Routes> 
     <Footer /> 
      
    </>
  )
}

export default App
