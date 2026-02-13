import React from "react";

const AddToCartButton = ({ art }) => {
  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const index = cart.findIndex((i) => i.id === art.id);

    if (index >= 0) {
      cart[index].qty += 1;
    } else {
      cart.push({
        id: art.id,
        name: art.name,
        price: art.price,
        img: art.image,
        description: art.description,
        category: art.category,
        qty: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdate"));
  };

  return (
    <button
      onClick={addToCart}
      className="px-4 py-2 bg-purple-600 text-white rounded"
    >
      Add to Cart
    </button>
  );
};

export default AddToCartButton;
