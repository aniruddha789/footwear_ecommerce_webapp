import { Dropdown, DropdownItem, Table } from "react-bootstrap";
import "./CartItem.css";
import Quantity from "../Quantity/Quantity";
import { useCallback, useState } from "react";

interface Props {
  title: string;
  price: number;
  img1: string;
  // onIncrease: () => void;
  // onDecrease: () => void;
}

function CartItem(props: Props) {
  const [quantity, setQuantity] = useState(0);

  useCallback(() => {
    console.log("Quantity: " + quantity);
  }, [quantity]);

  return (
    <div className="cartItem">
      <Table>
        <tr>
          <td>
              <img className="productImage" src={props.img1} /> 
          </td>
          <td>
            <h2 className="title"> {props.title} </h2>
          </td>
          <td>
            <h2 className="price"> {props.price} </h2>
          </td>
          <td>
            <Quantity
              onIncrease={() => {
                setQuantity(quantity + 1);
                console.log("Increase called: " + quantity);
              }}
              onDecrease={() => {
                quantity == 0 ? null : setQuantity(quantity - 1);
                console.log("Decrease called: " + quantity);
              }}
            />
          </td>
        </tr>
      </Table>
    </div>
  );
}

export default CartItem;
