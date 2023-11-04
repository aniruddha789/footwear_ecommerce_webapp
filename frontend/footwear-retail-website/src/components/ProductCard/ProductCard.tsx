import "./ProductCard.css";
import ImageSlider from "../ImageSlider/ImageSlider";

interface Props {
  name: string;
  text: string;
  price: number;
}

function ProductCard(props: Props) {
  return (
    <div className="b">
      <div className="cardProduct">
        <div className="productImg">
          <ImageSlider />
        </div>
        {/* <img src="/src/assets/IMG20220127180432_01.jpg" width = "100%" className="card-img-top" alt="..."></img> */}
        <h4 className="card-title">{props.name}</h4>
        <div className="card-body">
          <p className="card-text">{props.text}</p>
          <p className="card-price"> ₹ {props.price}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
