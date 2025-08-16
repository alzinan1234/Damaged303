// src/app/admin/ad-management/page.jsx
"use client";

import React, { useState, useMemo } from "react";
import { PlusIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";

// Dummy data for initial display
const dummyAds = Array.from({ length: 20 }).map((_, i) => ({
  id: `ad-${i + 1}`,
  adType: i % 2 === 0 ? "Image" : "Video",
  brand: `Brand-${i + 1}`,
  mediaUrl: i % 2 === 0 
    ? "https://placehold.co/400x200/212a4d/ffffff?text=Image+Ad" 
    : "https://placehold.co/400x200/212a4d/ffffff?text=Video+Ad",
  joinedDate: new Date(Date.now() - Math.random() * 86400000 * 30).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }),
  isActive: i % 3 !== 0,
}));

export default function AdManagementTable() {
  const [ads, setAds] = useState(dummyAds);
  const [editingAd, setEditingAd] = useState(null);
  const [formState, setFormState] = useState({
    adType: "Image",
    brand: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  // Handle changes for text and select inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    // Clear the file and preview if the ad type changes
    if (name === "adType") {
      setSelectedFile(null);
      setMediaPreview(null);
    }
  };

  // Handle file selection and create a temporary preview URL
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a temporary URL for file preview
      const fileUrl = URL.createObjectURL(file);
      setMediaPreview(fileUrl);
    }
  };

  const handleAddOrEditAd = (e) => {
    e.preventDefault();

    if (!formState.brand || !selectedFile) {
      toast.error("Brand and media file are required.");
      return;
    }

    // Create a new ad object with the selected media file
    const newAdData = {
      ...formState,
      mediaUrl: mediaPreview,
      joinedDate: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }),
      isActive: true,
    };

    if (editingAd) {
      // Edit an existing ad (this part is now inactive but kept for logic)
      setAds(prev =>
        prev.map(ad =>
          ad.id === editingAd.id ? {
            ...ad,
            ...newAdData,
          } : ad
        )
      );
      toast.success("Ad updated successfully!");
    } else {
      // Add a new ad
      const newAd = {
        ...newAdData,
        id: `ad-${Date.now()}`,
      };
      setAds(prev => [newAd, ...prev]);
      toast.success("Ad created successfully!");
    }

    // Reset form and editing state
    setFormState({ adType: "Image", brand: "" });
    setEditingAd(null);
    setSelectedFile(null);
    setMediaPreview(null);
  };

  const handleDeleteAd = (id) => {
    setAds(prev => prev.filter(ad => ad.id !== id));
    toast.success("Ad deleted successfully!");
  };

  const handleEditAd = (ad) => {
    setEditingAd(ad);
    setFormState({
      adType: ad.adType,
      brand: ad.brand,
    });
    // Set the media preview for the ad being edited
    setMediaPreview(ad.mediaUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form
  };

  const handleToggleActive = (id) => {
    setAds(prev =>
      prev.map(ad =>
        ad.id === id ? { ...ad, isActive: !ad.isActive } : ad
      )
    );
    toast.success("Ad status updated!");
  };

  const renderMediaPreview = () => {
    if (!mediaPreview) return null;

    if (formState.adType === 'Image') {
      return <img src={mediaPreview} alt="Ad preview" className="w-[300] h-[300] rounded-md mt-4" />;
    } else if (formState.adType === 'Video') {
      return <video src={mediaPreview} controls className="w-[300] h-[300] rounded-md mt-4" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-white text-black">
      <Toaster position="top-center" />
      <h2 className="text-2xl font-semibold mb-6">Ad Management</h2>

      {/* Add/Edit Ad Form */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">{editingAd ? "Edit Ad" : "Add New Ad"}</h3>
        <form onSubmit={handleAddOrEditAd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="adType" className="text-sm font-medium text-gray-700 mb-1">Ad Type</label>
            <select
              id="adType"
              name="adType"
              value={formState.adType}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Image">Image</option>
              <option value="Video">Video</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="brand" className="text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input
              type="text"
              id="brand"
              name="brand"
              placeholder="Enter brand name"
              value={formState.brand}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label htmlFor="mediaFile" className="text-sm font-medium text-gray-700 mb-1">
              {formState.adType} File
            </label>
            <input
              type="file"
              id="mediaFile"
              name="mediaFile"
              accept={formState.adType === 'Image' ? "image/*" : "video/*"}
              onChange={handleFileChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-black hover:file:bg-gray-300"
            />
            {renderMediaPreview()}
          </div>
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-[#013D3B] text-white font-semibold rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              <PlusIcon className="h-5 w-5" />
              Add Ad
            </button>
            {editingAd && (
              <button
                type="button"
                onClick={() => {
                  setEditingAd(null);
                  setFormState({ adType: "Image", brand: "" });
                  setSelectedFile(null);
                  setMediaPreview(null);
                }}
                className="w-full md:w-auto ml-0 md:ml-2 mt-2 md:mt-0 px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Ad Table */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-xl overflow-x-auto border border-gray-200">
        <table className="w-full text-sm text-black table-auto">
          <thead className="text-left bg-gray-100">
            <tr>
              <th className="py-3 px-4 rounded-tl-lg">Ad Type</th>
              <th className="py-3 px-4">Brand</th>
              <th className="py-3 px-4">Media</th>
              <th className="py-3 px-4">Joined Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 rounded-tr-lg text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.length > 0 ? (
              ads.map((ad) => (
                <tr key={ad.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-3 px-4 font-medium">{ad.adType}</td>
                  <td className="py-3 px-4 font-semibold">{ad.brand}</td>
                  <td className="py-3 px-4">
                    {ad.adType === 'Image' ? (
                      <img src={ad.mediaUrl} alt="Ad media" className="w-20 h-10 object-cover rounded-md" />
                    ) : (
                      <video src={ad.mediaUrl} className="w-20 h-10 object-cover rounded-md" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{ad.joinedDate}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${ad.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {ad.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button onClick={() => handleToggleActive(ad.id)} className={`transition-colors duration-200 ${ad.isActive ? "text-red-500 hover:text-red-600" : "text-green-500 hover:text-green-600"}`} title={ad.isActive ? "Deactivate" : "Activate"}>
                        {ad.isActive ? <XCircleIcon className="h-5 w-5" /> : <CheckCircleIcon className="h-5 w-5" />}
                      </button>
                      <button onClick={() => handleDeleteAd(ad.id)} className="text-red-500 hover:text-red-600 transition-colors duration-200" title="Delete">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">No ads found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
