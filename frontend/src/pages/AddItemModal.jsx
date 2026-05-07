import { useState } from "react";
import axios from "axios";
import { IoIosArrowDown } from "react-icons/io";
import "./AddItemModal.css";

function AddItemModal({ onClose, onAdd }) {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleItemNameChange = async e => {
    const value = e.target.value;
    setItemName(value);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5001/api/items/suggestions?query=${encodeURIComponent(value)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuggestions(response.data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Failed to fetch item suggestions:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    const trimmedName = itemName.trim();

    if (!trimmedName || !category) {
      return;
    }

    onAdd({
      name: trimmedName,
      category,
      quantity,
      checked: false,
    });
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="bottom-modal-overlay" onClick={onClose}>
      <div className="add-item-sheet" onClick={e => e.stopPropagation()}>
        <h2 className="add-item-title">ADD ITEM</h2>

        <form className="add-item-form" onSubmit={handleSubmit}>
          <div className="suggestion-wrapper">
            <input
              type="text"
              className="add-item-input"
              placeholder="Item"
              value={itemName}
              onChange={handleItemNameChange}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
            />

            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {suggestions.map(suggestion => (
                  <div
                    key={suggestion}
                    className="suggestion-item"
                    onClick={() => {
                      setItemName(suggestion);
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }}>
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="custom-select">
            <div className="select-box" onClick={() => setIsOpen(!isOpen)}>
              <span>{category || "Select a category"}</span>
              <IoIosArrowDown />
            </div>

            {isOpen && (
              <div className="dropdown">
                {["Fruit", "Veggies", "Bread", "Dairy", "Meat", "Seafood"].map(
                  item => (
                    <div
                      key={item}
                      className="dropdown-item"
                      onClick={() => {
                        setCategory(item);
                        setIsOpen(false);
                      }}>
                      {item}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
          <div className="quantity-row">
            <span className="quantity-label">Quantity</span>

            <div className="quantity-controls">
              <button
                type="button"
                className="qty-button"
                onClick={handleDecrease}>
                -
              </button>

              <span className="qty-value">{quantity}</span>

              <button
                type="button"
                className="qty-button"
                onClick={handleIncrease}>
                +
              </button>
            </div>
          </div>
          <button type="submit" className="add-submit-button">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddItemModal;