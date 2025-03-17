import { Trophy } from "lucide-react";
import React, { useEffect, useState } from "react";
import { resolvePath, useViewTransitionState } from "react-router";

const AddItemModal = ({ closeModal, refreshProducts }) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

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

  const validateForm = () => {
    const errors = {};


    // Check Brand if not null
    if (!formData.brand.trim()){
      errors.brand = "Please enter the brand"
    }

    // Check Product Name if not null
    if (!formData.productName.trim()){
      errors.productName = "Product name is required"
    }

    if (!formData.quantityStock) {
      errors.quantityStock = "Quantity is required"
    } else if (parseInt(formData.quantityStock) <= 0) {
      errors.quantityStock = "Enter a valid quantity"
    }

    if (!formData.gettingPrice) {
      errors.gettingPrice = "Getting price is required"
    } else if (parseFloat(formData.gettingPrice) <= 0) {
      errors.gettingPrice = "Enter a valid getting price"
    }

    if (!formData.sellingPrice) {
      errors.sellingPrice = "Selling price is required"
    } else if (parseFloat(formData.sellingPrice) <= 0) {
      errors.sellingPrice = "Enter a valid selling price"
    }

    if (parseInt(formData.categoryId) === 0) {
      errors.categoryId = "Please select a category"
    }

    // Set the validation errors state
    setValidationErrors(errors);

    // Return true if there are no errors
    return Object.keys(errors).length === 0;

  }

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try{
      // Convert numeric values
      const productData = {
        ...formData,
        quantityStock: parseInt(formData.quantityStock, 10) || 0,
        gettingPrice: parseFloat(formData.gettingPrice) || 0,
        sellingPrice: parseFloat(formData.sellingPrice) || 0,
        categoryId: parseInt(formData.categoryId, 10) || 0
      };

      const response = await fetch("https://localhost:7144/api/Product/add-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData || "Failed to add product.");
      }

      // Success - close modal and refresh product list
      closeModal();
      if (refreshProducts) {
        refreshProducts();
      }
    }
    catch( error) {
      setError(error.message || "An error occurred while adding product.");
    }
    finally{
      setIsSubmitting(false);
    }
  }
  
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

        {error && (
          <div className="bg-red-100 text-red-800 p2 rounded mt-2 mb-2">{error}</div>
        )}

        <div>
        <form className="mt-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2" >
             
             <div className="flex flex-col items-start">
                <label>Brand</label>
                <input type="text"
                          id="brand"
                          name="brand"
                          value={formData.brand}
                          onChange={handleChange}
                          className={`border border-gray-300 rounded p-2 w-full ${validationErrors.brand ? "border-red-500" : ""}`}
                          />
             </div>
              
             <div className="flex flex-col items-start">
              <label>Product Name</label>
              <input type="text"
                      id="productName"
                      name="productName"
                      value={formData.productName}
                      onChange={handleChange}
                      className={`border border-gray-300 rounded p-2 w-full ${validationErrors.productName ? "border-red-500" : ""}`} />
             </div>
              
             <div className="flex flex-col items-start">
              <label>Quantity</label>
              <input type="number"
                      id="quantityStock"
                      name="quantityStock"
                      value={formData.quantityStock}
                      onChange={handleChange}
                      className={`border border-gray-300 rounded p-2 w-full ${validationErrors.quantityStock ? "border-red-500" : ""}`} />
             </div>

             <div className="flex flex-col items-start">
              <label>Get Price</label>
              <input type="number" step="0.01"
                      id="gettingPrice"
                      name="gettingPrice"
                      value={formData.gettingPrice}
                      onChange={handleChange}
                      className={`border border-gray-300 rounded p-2 w-full ${validationErrors.gettingPrice ? "border-red-500" : ""}`} />
             </div>
              
             <div className="flex flex-col items-start">
              <label>Selling Price</label>
              <input type="number" step="0.01"
                      id="sellingPrice"
                      name="sellingPrice"
                      value={formData.sellingPrice}
                      onChange={handleChange}
                      className={`border border-gray-300 rounded p-2 w-full ${validationErrors.sellingPrice ? "border-red-500" : ""}`} />
             </div>
              
             <div className="flex flex-col items-start">
              <label>Status</label>
              <input type="text"
                      id="status"
                      value={formData.status}
                      onChange={handleChange}
                      readOnly
                      className="border border-gray-300 rounded p-2 w-full text-gray-800" />
             </div>
              
             <div className="flex flex-col items-start">
              <label>Category</label>
              <select name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className={`border border-gray-300 rounded p-2 w-full ${validationErrors.categoryId ? "border-red-500" : ""}`}>
                            <option value="0">Please select a category</option>
                            {categories.map((category) => (
                              <option key={category.categoryId} value={category.categoryId}>
                                  {category.categoryName}
                              </option>
                            ))}
                </select>
             </div>
             
              

              <button type="submit"
                      disabled={isSubmitting}
               className="bg-blue-500/80 text-white py-2 font-bold mt-4 disabled:bg-blue-300">
                  {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
        </form>
      </div>
      </div>

     
    </div>
  );
};

export default AddItemModal;
