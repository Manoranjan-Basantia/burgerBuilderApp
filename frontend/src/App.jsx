import { useState } from "react";
import axios from "axios";

function App() {
  const [quantity, setQuantity] = useState(1);

  const [formData, setFormData] = useState({
    customerName: "",
    mobile: "",
    address: "",
    paymentMethod: "COD",
  });

  const [slices, setSlices] = useState(["bread", "aloo tikki", "bread"]);

  const ingredients = [
    "aloo tikki",
    "paneer",
    "cheese",
    "tomato",
    "onion",
    "lettuce",
  ];

  const prices = {
    bread: 0,
    "aloo tikki": 20,
    paneer: 25,
    cheese: 15,
    tomato: 10,
    onion: 10,
    lettuce: 8,
  };

  const addSlice = (item) => {
    if (slices.length >= 10) {
      alert("Maximum 10 slices allowed");
      return;
    }

    const updated = [...slices];

    updated.splice(updated.length - 1, 0, item);

    setSlices(updated);
  };

  const removeSlice = (index) => {
    if (slices[index] === "bread") return;

    const updated = slices.filter((_, i) => i !== index);

    setSlices(updated);
  };

  const moveUp = (index) => {
    if (index <= 1) return;

    const updated = [...slices];

    [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];

    setSlices(updated);
  };

  const moveDown = (index) => {
    if (index >= slices.length - 2) return;

    const updated = [...slices];

    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];

    setSlices(updated);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculatePrice = () => {
    let total = 0;

    slices.forEach((slice) => {
      total += prices[slice];
    });

    // cheese + paneer discount
    if (slices.includes("cheese") && slices.includes("paneer")) {
      total -= 3;
    }

    // double aloo tikki charge
    for (let i = 0; i < slices.length - 1; i++) {
      if (slices[i] === "aloo tikki" && slices[i + 1] === "aloo tikki") {
        total += 2;
      }
    }

    const platformFee = 5;

    return total * quantity + platformFee;
  };

  const handleSubmit = async () => {
    if (!formData.customerName || !formData.mobile || !formData.address) {
      alert("Please fill all fields");
      return;
    }

    try {
      const payload = {
        ...formData,
        quantity,
        slices,
        totalPrice: calculatePrice(),
      };

      const response = await axios.post(
        "https://burgerbuilderapp-backend.onrender.com/api/order/create",
        payload,
      );

      alert("Order Placed Successfully");

      console.log(response.data);

      setFormData({
        customerName: "",
        mobile: "",
        address: "",
        paymentMethod: "COD",
      });

      setSlices(["bread", "aloo tikki", "bread"]);

      setQuantity(1);
    } catch (error) {
      console.log(error);

      alert("Something went wrong");
    }
  };

  return (
    <div className="p-10 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">
        BURGER BUILDER BY MANORANJAN
      </h1>

      {/* Ingredient Buttons */}

      <div className="flex gap-3 flex-wrap justify-center mb-8">
        {ingredients.map((item) => (
          <button
            key={item}
            onClick={() => addSlice(item)}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Add {item}
          </button>
        ))}
      </div>

      {/* Chef Suggestion */}

      {slices.length > 6 && (
        <p className="text-center text-red-500 font-semibold mb-6">
          Chef suggests splitting this burger into two burgers.
        </p>
      )}

      {/* Burger Visualization */}

      <div className="max-w-md mx-auto space-y-3 mb-8">
        {slices.map((slice, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg flex justify-between items-center
            ${
              slice === "bread"
                ? "bg-yellow-600"
                : slice === "aloo tikki"
                  ? "bg-amber-800"
                  : slice === "paneer"
                    ? "bg-orange-300"
                    : slice === "cheese"
                      ? "bg-yellow-300"
                      : slice === "tomato"
                        ? "bg-red-400"
                        : slice === "onion"
                          ? "bg-purple-300"
                          : "bg-green-400"
            }`}
          >
            <span className="capitalize font-semibold text-black">{slice}</span>

            {slice !== "bread" && (
              <div className="flex gap-2">
                {index !== 1 && (
                  <button
                    onClick={() => moveUp(index)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    ↑
                  </button>
                )}

                {index !== slices.length - 2 && (
                  <button
                    onClick={() => moveDown(index)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    ↓
                  </button>
                )}

                <button
                  onClick={() => removeSlice(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quantity */}

      <div className="flex justify-center items-center gap-4 mb-8">
        <button
          onClick={() => setQuantity(quantity - 1)}
          disabled={quantity <= 1}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          -
        </button>

        <span className="text-2xl font-bold">{quantity}</span>

        <button
          onClick={() => setQuantity(quantity + 1)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          +
        </button>
      </div>

      {/* Price */}

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-6">Total: ₹ {calculatePrice()}</h2>

        {/* Form */}

        <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow space-y-4">
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            placeholder="Customer Name"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            placeholder="Mobile Number"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <textarea
            name="address"
            value={formData.address}
            placeholder="Address"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          >
            <option value="COD">COD</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>

          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
