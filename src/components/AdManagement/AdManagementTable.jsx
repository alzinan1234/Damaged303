"use client";

import React, { useState, useEffect } from "react";
import { PlusIcon, TrashIcon, CheckCircleIcon, XCircleIcon, PencilIcon } from "@heroicons/react/24/outline";

// Real API configuration - Update base_url with your actual domain
const API_BASE_URL = "https://maintains-usb-bell-with.trycloudflare.com/api";

// Helper function to get auth token (from cookies or localStorage)
const getAuthToken = () => {
  // First try to get from cookies
  const cookieToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('adminToken='))
    ?.split('=')[1];
  
  // If not in cookies, try localStorage
  if (cookieToken) return cookieToken;
  
  const localToken = localStorage.getItem('token');
  return localToken;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Helper function to get auth headers for FormData
const getAuthHeadersForFormData = () => {
  const token = getAuthToken();
  return {
    'Authorization': `Bearer ${token}`,
    // Don't set Content-Type for FormData - let the browser set it
  };
};

// API Functions
const api = {
  // Get categories
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/news/categories/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  // Get all products
  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/affiliate/admin/products/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  // Create product
  createProduct: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/affiliate/admin/products/`, {
      method: 'POST',
      headers: getAuthHeadersForFormData(),
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  // Update product
  updateProduct: async (id, formData) => {
    const response = await fetch(`${API_BASE_URL}/affiliate/admin/products/${id}/`, {
      method: 'PUT',
      headers: getAuthHeadersForFormData(),
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/affiliate/admin/products/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return response.ok;
  },

  // Toggle product status
  toggleProductStatus: async (id, isActive) => {
    const response = await fetch(`${API_BASE_URL}/affiliate/admin/products/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ is_active: isActive }),
    });
    if (!response.ok) throw new Error('Failed to update product status');
    return response.json();
  },
};

export default function AffiliateProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(false);
  const [formState, setFormState] = useState({
    category: "",
    title: "",
    affiliate_url: "",
    disclaimer: "As an Amazon Associate, we may earn from qualifying purchases",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await api.getCategories();
      setCategories(data.data || []);
      console.log("Categories loaded:", data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      if (error.message.includes('Failed to fetch') || error.message.includes('401')) {
        setAuthError(true);
      }
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data.results || []);
      console.log("Products loaded:", data.results);
    } catch (error) {
      console.error("Error fetching products:", error);
      if (error.message.includes('Failed to fetch') || error.message.includes('401')) {
        setAuthError(true);
      }
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setImagePreview(fileUrl);
    }
  };

  const handleSubmit = async () => {
    
    if (!formState.category || !formState.title || !formState.affiliate_url) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('category', formState.category);
      formData.append('title', formState.title);
      formData.append('affiliate_url', formState.affiliate_url);
      formData.append('disclaimer', formState.disclaimer);
      formData.append('is_active', 'true');
      
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      let result;
      if (editingProduct) {
        // Update existing product
        result = await api.updateProduct(editingProduct.id, formData);
        alert("Product updated successfully!");
      } else {
        // Create new product
        result = await api.createProduct(formData);
        alert("Product created successfully!");
      }

      // Refresh the products list
      await fetchProducts();

      // Reset form
      setFormState({
        category: "",
        title: "",
        affiliate_url: "",
        disclaimer: "As an Amazon Associate, we may earn from qualifying purchases",
      });
      setEditingProduct(null);
      setSelectedFile(null);
      setImagePreview(null);

    } catch (error) {
      console.error("Error saving product:", error);
      if (error.message.includes('Failed to fetch') || error.message.includes('401')) {
        setAuthError(true);
      }
      alert(`Error saving product: ${error.message}`);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormState({
      category: product.category.toString(),
      title: product.title,
      affiliate_url: product.affiliate_url,
      disclaimer: product.disclaimer,
    });
    setImagePreview(product.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      setLoading(true);
      await api.deleteProduct(id);
      alert("Product deleted successfully!");
      
      // Refresh the products list
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      if (error.message.includes('Failed to fetch') || error.message.includes('401')) {
        setAuthError(true);
      }
      alert(`Error deleting product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const product = products.find(p => p.id === id);
      const newStatus = !product.is_active;
      
      await api.toggleProductStatus(id, newStatus);
      alert("Product status updated!");
      
      // Refresh the products list
      await fetchProducts();
    } catch (error) {
      console.error("Error updating product status:", error);
      if (error.message.includes('Failed to fetch') || error.message.includes('401')) {
        setAuthError(true);
      }
      alert(`Error updating product status: ${error.message}`);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setFormState({
      category: "",
      title: "",
      affiliate_url: "",
      disclaimer: "As an Amazon Associate, we may earn from qualifying purchases",
    });
    setSelectedFile(null);
    setImagePreview(null);
  };

  // If authentication error, show message
  if (authError) {
    return (
      <div className="min-h-screen p-4 sm:p-8 bg-white text-black flex items-center justify-center">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-red-800">Authentication Error</h2>
          <p className="mb-4 text-red-600">
            You need to be logged in to access this page. Please log in and try again.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-white text-black">
      <h2 className="text-2xl font-semibold mb-6 text-[#013D3B]">Affiliate Product Management</h2>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="text-red-800">{error}</div>
          <button 
            onClick={() => setError(null)} 
            className="text-red-600 hover:text-red-800 text-sm mt-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Add/Edit Product Form */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200 shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-[#013D3B]">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </h3>
        
        {/* API Connection Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm">
          <p className="text-blue-800">
            ✅ Bearer token authentication added to all API calls
          </p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Dropdown */}
            <div className="flex flex-col">
              <label htmlFor="category" className="text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formState.category}
                onChange={handleInputChange}
                required
                className="p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#013D3B] focus:border-[#013D3B]"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Title */}
            <div className="flex flex-col">
              <label htmlFor="title" className="text-sm font-medium text-gray-700 mb-1">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter product title"
                value={formState.title}
                onChange={handleInputChange}
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#013D3B] focus:border-[#013D3B]"
              />
            </div>
          </div>

          {/* Affiliate URL */}
          <div className="flex flex-col">
            <label htmlFor="affiliate_url" className="text-sm font-medium text-gray-700 mb-1">
              Affiliate URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="affiliate_url"
              name="affiliate_url"
              placeholder="https://www.amazon.com/..."
              value={formState.affiliate_url}
              onChange={handleInputChange}
              required
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#013D3B] focus:border-[#013D3B]"
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col">
            <label htmlFor="image" className="text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#013D3B] focus:border-[#013D3B] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#013D3B] file:text-white hover:file:bg-gray-700"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Product preview"
                className="w-32 h-20 object-cover rounded-md mt-2 border border-gray-200"
              />
            )}
          </div>

          {/* Disclaimer */}
          <div className="flex flex-col">
            <label htmlFor="disclaimer" className="text-sm font-medium text-gray-700 mb-1">
              Disclaimer
            </label>
            <textarea
              id="disclaimer"
              name="disclaimer"
              rows={2}
              value={formState.disclaimer}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#013D3B] focus:border-[#013D3B]"
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap gap-2 pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-[#013D3B] text-white font-semibold rounded-md hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="h-5 w-5" />
              {loading ? "Saving..." : (editingProduct ? "Update Product" : "Add Product")}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-black">
            <thead className="text-left bg-gray-100">
              <tr>
                <th className="py-4 px-4 font-semibold">Image</th>
                <th className="py-4 px-4 font-semibold">Product Title</th>
                <th className="py-4 px-4 font-semibold">Category</th>
                <th className="py-4 px-4 font-semibold">Clicks</th>
                <th className="py-4 px-4 font-semibold">Status</th>
                <th className="py-4 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">Loading...</td>
                </tr>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                    <td className="py-4 px-4">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-16 h-12 object-cover rounded-md border border-gray-200"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-[#013D3B] truncate max-w-xs" title={product.title}>
                        {product.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Created: {new Date(product.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-[#013D3B] text-white text-xs rounded-full">
                        {getCategoryName(product.category)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="font-semibold text-[#013D3B]">{product.total_clicks}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.is_active 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-[#013D3B] hover:text-gray-700 transition-colors duration-200"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(product.id)}
                          className={`transition-colors duration-200 ${
                            product.is_active 
                              ? "text-red-500 hover:text-red-600" 
                              : "text-green-500 hover:text-green-600"
                          }`}
                          title={product.is_active ? "Deactivate" : "Activate"}
                        >
                          {product.is_active ? (
                            <XCircleIcon className="h-5 w-5" />
                          ) : (
                            <CheckCircleIcon className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500 hover:text-red-600 transition-colors duration-200"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-2">📦</div>
                      <div>No affiliate products found</div>
                      <div className="text-sm mt-1">Create your first product above!</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}