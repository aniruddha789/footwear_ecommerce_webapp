import ProductGrid from "../../containers/ProductGrid/ProductGrid";

function Tops({showProductButton}) {
  return (
    <div>
      <ProductGrid showProductFun={showProductButton} ></ProductGrid>
    
    </div>
  );
}
export default Tops;
