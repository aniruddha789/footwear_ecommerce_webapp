import offwhite1 from '../../../src/assets/300952867OFFWHITE_1.webp';
import offwhite2 from '../../../src/assets/300952867OFFWHITE_2.webp';
import offwhite3 from '../../../src/assets/300952867OFFWHITE_3.webp';
import ProductCard from '../../components/ProductCard/ProductCard';

function ProductGrid({showProductFun}) {
  return (
    <div className="productGrid">
      <div className="container">
        <div className="row ">
          <div className="col-lg-3 col-6">
            <ProductCard
              name="StudioFit"
              text="Studiofit Off White Relaxed Fit Hoodie Sweatshirt"
              price={1299}
              img1={offwhite1}
              img2={offwhite2}
              img3={offwhite3}
              onClick={showProductFun}
            />
          </div>

          <div className="col-lg-3 col-6">
            <ProductCard
              name="StudioFit"
              text="Studiofit Off White Relaxed Fit Hoodie Sweatshirt"
              price={1299}
              img1={offwhite1}
              img2={offwhite2}
              img3={offwhite3}
            />
          </div>

          <div className="col-lg-3 col-6">
            <ProductCard
              name="StudioFit"
              text="Studiofit Off White Relaxed Fit Hoodie Sweatshirt"
              price={1299}
              img1={offwhite1}
              img2={offwhite2}
              img3={offwhite3}
            />
          </div>

          <div className="col-lg-3 col-6">
            <ProductCard
              name="StudioFit"
              text="Studiofit Off White Relaxed Fit Hoodie Sweatshirt"
              price={1299}
              img1={offwhite1}
              img2={offwhite2}
              img3={offwhite3}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-3 col-6">
            <ProductCard
              name="StudioFit"
              text="Studiofit Off White Relaxed Fit Hoodie Sweatshirt"
              price={1299}
              img1={offwhite1}
              img2={offwhite2}
              img3={offwhite3}
            />
          </div>

          <div className="col-lg-3 col-6">
            <ProductCard
              name="StudioFit"
              text="Studiofit Off White Relaxed Fit Hoodie Sweatshirt"
              price={1299}
              img1={offwhite1}
              img2={offwhite2}
              img3={offwhite3}
            />
          </div>

          <div className="col-lg-3 col-6">
            <ProductCard
              name="StudioFit"
              text="Studiofit Off White Relaxed Fit Hoodie Sweatshirt"
              price={1299}
              img1={offwhite1}
              img2={offwhite2}
              img3={offwhite3}
            />
          </div>

          <div className="col-lg-3 col-6">
            <ProductCard
              name="StudioFit"
              text="Studiofit Off White Relaxed Fit Hoodie Sweatshirt"
              price={1299}
              img1={offwhite1}
              img2={offwhite2}
              img3={offwhite3}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductGrid;
