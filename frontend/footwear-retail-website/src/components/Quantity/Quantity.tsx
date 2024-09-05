import React, { useState, useCallback } from 'react';
//import ReactDOM from 'react-dom';

interface QuantityProps {
    onDecrease: () => void;
    onIncrease: () => void;
}

const Quantity: React.FC<QuantityProps> = (props) => {
  const [value, setValue] = useState<number>(1);

  const increment = useCallback(() => {
    setValue((prevValue) => prevValue + 1);
    props.onIncrease();
  }, [props]);

  const decrement = useCallback(() => {
    setValue((prevValue) => (prevValue > 0 ? prevValue - 1 : 0));
    props.onDecrease();
  }, [props]);

  return (
    <div>
      <p>Quantity</p>
      <div className="quantity-input">
        <button
          className="quantity-input__modifier quantity-input__modifier--left"
          onClick={decrement}
        >
          &mdash;
        </button>
        <input
          className="quantity-input__screen"
          type="text"
          value={value}
          readOnly
        />
        <button
          className="quantity-input__modifier quantity-input__modifier--right"
          onClick={increment}
        >
          &#xff0b;
        </button>
      </div>
    </div>
  );
};

export default Quantity;

//ReactDOM.render(<Quantity />, document.getElementById('app'));
