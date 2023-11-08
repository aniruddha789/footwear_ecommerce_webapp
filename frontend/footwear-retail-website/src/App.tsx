import './App.css'
import NavBar from './components/NavBar/NavBar'
import ProductCard from './components/ProductCard/ProductCard'
import "bootstrap/dist/css/bootstrap.min.css"


function App() {

  return (
    <>
    <NavBar/>
    <div className="container">
    
      
      <div className='row '>
        
      <div className = "col-lg-3 col-6">
      <ProductCard name="StudioFit" text="Studiofit Off White Relaxed Fit Hoodie Sweatshirt" price={1299}/>
      </div>

      <div className = "col-lg-3 col-6">
      <ProductCard name="StudioFit" text="Studiofit Off White Relaxed Fit Hoodie Sweatshirt" price={1299}/>
      </div>

      <div className = "col-lg-3 col-6">
      <ProductCard name="StudioFit" text="Studiofit Off White Relaxed Fit Hoodie Sweatshirt" price={1299}/>
      </div>

      <div className = "col-lg-3 col-6">
      <ProductCard name="StudioFit" text="Studiofit Off White Relaxed Fit Hoodie Sweatshirt" price={1299}/>
      </div>

       </div>

       <div className='row'>

       <div className = "col-lg-3 col-6">
      <ProductCard name="StudioFit" text="Studiofit Off White Relaxed Fit Hoodie Sweatshirt" price={1299}/>
      </div>

      <div className = "col-lg-3 col-6">
      <ProductCard name="StudioFit" text="Studiofit Off White Relaxed Fit Hoodie Sweatshirt" price={1299}/>
      </div>

      <div className = "col-lg-3 col-6">
      <ProductCard name="StudioFit" text="Studiofit Off White Relaxed Fit Hoodie Sweatshirt" price={1299}/>
      </div>
      
      <div className = "col-lg-3 col-6">
      <ProductCard name="StudioFit" text="Studiofit Off White Relaxed Fit Hoodie Sweatshirt" price={1299}/>
      </div>
        

       </div>

    </div>

    </>
  )
}

export default App
