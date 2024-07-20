import "./ProductCard.css";
import ImageSlider from "../ImageSlider/ImageSlider";
import Quantity from "../Quantity/Quantity";


interface Props {
  name: string;
  text: string;
  price: number;
  img1: string;
  img2: string;
  img3: string;
}

function ProductCard(props: Props) {
  return (
    // <a href="https://www.google.com">
    <div className="b">
      <div className="cardProduct">
        <div className="productImg">
          <ImageSlider img1={props.img1} img2={props.img2} img3={props.img3}/>
        </div>
        {/* <img src="/src/assets/IMG20220127180432_01.jpg" width = "100%" className="card-img-top" alt="..."></img> */}
        <h4 className="card-title">{props.name}</h4>
        <div className="card-body">
          <p className="card-text">{props.text}</p>
          <p className="card-price"> ₹ {props.price}</p>
        </div>
      </div>
    </div>
    // </a>
  );
}

export default ProductCard;
