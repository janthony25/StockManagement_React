import { Trophy } from "lucide-react";
import React, { useEffect, useState } from "react";
import { resolvePath, useViewTransitionState } from "react-router";

const AddItemModal = ({ closeModal }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({
    brand: "",
    productName: "",
    quantityStock: "",
    gettingPrice: "",
    sellingPrice: "",
    status: "In Stock",
    categoryId: 0
  });

  // Fetching categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://localhost:7144/api/Category/categories"
      );

      if (!response.ok) {
        throw new Error("An error occurred while fetching categories.");
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories.", error);
    }
  };

  
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    console.log(`${name}: ${value}`)
  };
  const handleClose = () => {
    closeModal();
  };

  const handleBgCloseModal = (e) => {
    if (e.target.id === "bg-modal") {
      closeModal();
    }
  };

  return (
    <div
      id="bg-modal"
      onClick={handleBgCloseModal}
      className="absolute top-0 left-0 w-screen h-screen bg-zinc-700/50 flex flex-col items-center"
    >
      <div className="flex flex-col justify-center bg-white p-4 m-4 w-10/12 md:w-7/12 max-w-screen-md shadow-2xl relative text-center">
        <a
          className="absolute top-1 right-2 cursor-pointer font-bold"
          onClick={handleClose}
        >
          {" "}
          X
        </a>
        <h1 className="text-lg uppercase font-bold text-blue-500">Add Item</h1>

        <div>
        <form className="mt-5">
            <div className="flex flex-col gap-2" >
              <input type="text"
                     id="brand"
                     name="brand"
                     value={formData.brand}
                     onChange={handleChange}
                     placeholder="Brand"
                     className="border border-gray-300 rounded p-2" />

              <input type="text"
                     id="productName"
                     name="productName"
                     value={formData.productName}
                     onChange={handleChange}
                     placeholder="Product Name"
                     className="border border-gray-300 rounded p-2" />

              <input type="number"
                     id="quantityStock"
                     name="quantityStock"
                     value={formData.quantityStock}
                     onChange={handleChange}
                     placeholder="Quantity Stock"
                     className="border border-gray-300 rounded p-2" />

              <input type="number" step="0.01"
                     id="sellingPrice"
                     name="sellingPrice"
                     value={formData.sellingPrice}
                     onChange={handleChange}
                     placeholder="Selling Price"
                     className="border border-gray-300 rounded p-2" />

              <input type="text"
                     id="status"
                     value={formData.status}
                     onChange={handleChange}
                     placeholder="Status"
                     className="border border-gray-300 rounded p-2" />

              <select name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="border border-gray-300 rounded p-2">
                          <option value="0">Please select a category</option>
                          {categories.map((category) => (
                            <option key={category.categoryId} value={category.categoryId}>
                                {category.categoryName}
                            </option>
                          ))}
              </select>
              

              <button className="bg-blue-500/80 text-white py-2 font-bold mt-4">Submit</button>
            </div>
        </form>
      </div>
      </div>

     
    </div>
  );
};

export default AddItemModal;
