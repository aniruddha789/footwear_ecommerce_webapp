import React, { useState, useEffect } from "react";
import "./ProductPage.css";
import {
  getProductById,
  addItemToCart,
  SubmitOrderRequest,
} from "../../services/api";
import { Product } from "../../types/Product";
import { useParams } from "react-router-dom";
import useIsMobile from "../../hooks/useIsMobile"; // Import the custom hook
import shipping_icon from "../../assets/fast-delivery.png";
import returns_icon from "../../assets/return-box.png";
import fashion_icon from "../../assets/clean-clothes.png";
import { colorMap } from "../../utils/colorMap";
import { useCart } from "../../context/CartContext";
import ImageSlider from "../../components/ImageSlider/ImageSlider";
import { toastInfo, toastSuccess } from "../../utils/customToast";
import ImageSliderPopup from "../../components/ImageSliderPopup/ImageSliderPopup";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSlider, setShowSlider] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const isMobile = useIsMobile(); // Use the custom hook
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]); // State for images
  const { addToCart } = useCart();
  // const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const fetchedProduct = await getProductById(Number(id));
          setProduct(fetchedProduct);
          console.log("Inventory: " + fetchedProduct.inventory);

          // Set initial selected color and size
          const selectedInventory = fetchedProduct.inventory[0]; // Get the first inventory item
          if (selectedInventory) {
            setSelectedColor(selectedInventory.color);
            setSelectedSize(selectedInventory.size);
          } else {
            // If no inventory, set default images from product.image
            setImages(
              fetchedProduct.image ? fetchedProduct.image.split(";") : []
            );
          }

          // Determine the images to display
          const inventoryImage = selectedInventory
            ? selectedInventory.image
            : null;
          const initialImages =
            inventoryImage && inventoryImage.trim() !== ""
              ? inventoryImage.split(";") // Split inventory image into an array
              : fetchedProduct.image && fetchedProduct.image.trim() !== ""
              ? fetchedProduct.image.split(";") // Split product image into an array
              : []; // Fallback to an empty array if no images are available
          setImages(initialImages); // Set initial images
          setAvailableSizes(fetchedProduct.inventory.map((item) => item.size)); // Set available sizes based on inventory
        }
      } catch (err) {
        setError("Failed to fetch product. Please try again later.");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      // Find the first inventory item that matches the selected color
      const matchingInventory = product.inventory.find(
        (item) => item.color === selectedColor
      );
      if (matchingInventory) {
        const inventoryImage = matchingInventory.image;
        const newImages =
          inventoryImage && inventoryImage.trim() !== ""
            ? inventoryImage.split(";") // Split inventory image into an array
            : product.image && product.image.trim() !== ""
            ? product.image.split(";") // Split product image into an array
            : []; // Fallback to an empty array if no images are available
        setImages(newImages); // Set images for the selected color
        setAvailableSizes(
          product.inventory
            .filter((item) => item.color === selectedColor)
            .map((item) => item.size)
        ); // Update available sizes
      } else {
        setAvailableSizes([]); // Clear sizes if no inventory found
      }
    }
  }, [selectedColor, product]);

  const cacheImages = (color: string, images: string[]) => {
    localStorage.setItem(
      `product-${id}-color-${color}`,
      JSON.stringify(images)
    );
  };

  const getCachedImages = (color: string): string[] | null => {
    const cachedImages = localStorage.getItem(`product-${id}-color-${color}`);
    return cachedImages ? JSON.parse(cachedImages) : null;
  };

  // // Function to handle image load
  // const handleImageLoad = () => {
  //   setImageLoading(false);
  // };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toastInfo("Please select both size and color");
      return;
    }

    if (!product) {
      toastInfo("Product not found");
      return;
    }

    try {
      // Get username from localStorage
      const username = localStorage.getItem("username");
      if (!username) {
        toastInfo("Please sign in to add items to cart");
        return;
      }

      // Prepare the request payload
      const orderRequest: SubmitOrderRequest = {
        username: username,
        addressId: -1, //No need to pass addressId here to add item. Add item and submit order are using same request model btw. 
        items: [
          {
            id: product.id, // This is already a number from the Product type
            quantity: 1,
            size: selectedSize,
            color: selectedColor,
          },
        ],
      };

      // Add to backend cart
      await addItemToCart(orderRequest);

      // Add to local cart
      addToCart(product, selectedSize, selectedColor);

      // Show success toast
      toastSuccess("Item added to cart successfully!");

    } catch (error) {
      console.error("Error adding item to cart:", error);
      // toastError("Failed to add item to cart. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  // Cache the images if they are not already cached
  if (!getCachedImages(selectedColor)) {
    cacheImages(selectedColor, images);
  }

  const getColorHex = (colorString: string): string => {
    const lowerCaseColor = colorString.toLowerCase();
    return colorMap[lowerCaseColor] || "#000000"; // Default to black if not found
  };

  // Check if the product is out of stock
  const isOutOfStock = availableSizes.length === 0;

  return (
    <div className={`product-page ${isMobile ? "mobile" : "desktop"}`}>
      <div className="product-images">
        {isMobile ? (
          <ImageSlider
            images={images.length > 0 ? images : [product.image]}
            onClick={() => {setShowSlider(true); console.log("showSlider: " + showSlider);}}
          />
        ) : (
          images.length > 0 &&
          images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={product.name}
              className="grid-image"
              onClick={() => {
                setSelectedImageIndex(index);
                setShowSlider(true);
              }}
              style={{ cursor: 'pointer' }}
              // onLoad={handleImageLoad}
            />
          ))
        )}
      </div>
      <div className="product-details">
        <h2 className="brand">{product.brandid}</h2>
        <h1 className="product-name">{product.name}</h1>
        <p className="price">
          ₹ {product.listprice}{" "}
          <span className="mrp">MRP incl. of all taxes</span>
        </p>
        <div className="color-section">
          <p className="color-label">COLOURS</p>
          <div className="color-options">
            {Array.from(
              new Set(product.inventory.map((item) => item.color))
            ).map((color) => (
              <div
                key={color}
                className={`color-option ${
                  color === selectedColor ? "selected" : ""
                }`}
                style={{ backgroundColor: getColorHex(color) }}
                onClick={() => {
                  setSelectedColor(color);
                  setSelectedSize(""); // Reset size when color changes
                }}
              ></div>
            ))}
          </div>
        </div>
        <div className="size-section">
          {/* <p className="size-label">
            SIZE <span className="size-guide">SIZE GUIDE</span>
          </p> */}
          {isOutOfStock ? (
            <div className="out-of-stock">Out of Stock</div>
          ) : (
            <div className="size-options">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  className={`size-option ${
                    size === selectedSize ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>
        {!isMobile && (
          <button className="add-to-bag" onClick={handleAddToCart}>
            ADD TO BAG
          </button>
        )}
        <div className="product-features">
          <div className="feature">
            <img src={shipping_icon} alt="Free shipping" />
            <p>Free shipping</p>
          </div>
          <div className="feature">
            <img src={returns_icon} alt="Easy Returns" />
            <p>Easy Returns</p>
          </div>
          <div className="feature">
            <img src={fashion_icon} alt="Fresh Fashion" />
            <p>Fresh Fashion</p>
          </div>
        </div>
        <div className="accordion product-details-section">
          <h2 className="accordion-header details-header">
            <button
              className="accordion-button custom-accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              Product Details and Overview
            </button>
          </h2>    
          <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
          <div className="accordion-body details-content">
            <p>
              <strong>Description:</strong> {product.description}
            </p>
            <p>
              <strong>Net Quantity:</strong> 1 
            </p>
            <p>
              <strong>Care Instruction:</strong> Normal Wash
            </p>
            <p>
              <strong>Marketed By:</strong>{" "} Urban Kicks
            </p>
            <p>
              <strong>Country Of Origin:</strong> India
            </p>
          </div>
          </div>
        </div>
      </div>
      
      {isMobile && (
        <div className="mobile-floating-cart-button">
          <button className="mobile-add-to-bag" onClick={handleAddToCart}>
            ADD TO BAG
          </button>
        </div>
      )}
      
      {showSlider && (
        <ImageSliderPopup
          images={images.length > 0 ? images : [product.image]}
          initialIndex={selectedImageIndex}
          onClose={() => setShowSlider(false)}
        />
      )}
    </div>
  );
};

export default ProductPage;
