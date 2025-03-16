import { SofaIcon, TableOfContents } from "lucide-react";
import React, { useEffect, useState } from "react";
import AddItemModal from "../modals/AddItemModal";

const StocksPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);


  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://localhost:7144/api/Product/products"
      );

      if (!response.ok) {
        throw new Error("An error occurred while fetching products.");
      }

      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching transactions", error);
      setError(error.message || "An error occurred while fetching products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Open Modal
  const openModal = () => {
    setShowModal(true);
  }

  // Close Modal
  const closeModal = () => {
    setShowModal(false);
  }

  // Table content based on state
  const tableContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="6" className="py-6 text-center text-gray-500">
            Loading products...
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan="6" className="py-6 text-center text-gray-500">
            {error}
          </td>
        </tr>
      );
    }

    if (products.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="py-10 text-center text-gray-500">
            No products available.
          </td>
        </tr>
      );
    }

    return products.map((product) => (
      <tr key={product.productId}>
        <td className="text-center">{product.productId}</td>
        <td className="text-center">{product.productName}</td>
        <td className="text-center">{product.quantityStock}</td>
        <td className="text-center">{product.sellingPrice}</td>
        <td className="py-3 px-4 text-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium inline-block min-w-20 ${
              product.status === "In Stock"
                ? "bg-green-100 text-green-800"
                : product.status === "Low Stock"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.status}
          </span>
        </td>
      </tr>
    ));
  };

  

  return (
    <div>
      <h1 className="text-3xl font-bold mb-10">Inventory Stocks</h1>

      <div className="flex justify-end">
          <button onClick={openModal}
           className="bg-blue-500/80 py-2 px-4 rounded-md mb-5 text-white hover:bg-blue-400 transition-all duration-300 cursor-pointer">ADD ITEM</button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Id
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableContent()}
          </tbody>
        </table>
      </div>


      {showModal && <AddItemModal closeModal={closeModal} />}
    </div>
  );
};

export default StocksPage;
