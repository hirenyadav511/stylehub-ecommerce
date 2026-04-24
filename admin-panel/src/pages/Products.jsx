import React, { useState, useEffect } from "react";
import api from "../services/api";
import { formatPrice } from "../utils/formatters";
import { CATEGORY_SIZES, PRODUCT_CATEGORIES } from "../utils/constants";


const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "T-Shirts", // Default
    brand: "",
    material: "",
    images: [],
    description: "",
    variants: [],
  });

  // Variant addition state
  const [variantInput, setVariantInput] = useState({
    size: "M",
    color: "",
    stock: 0
  });

  // Admin Filtering States
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products", {
        params: {
            category: categoryFilter,
            brand: brandFilter,
            keyword: searchTerm
        }
      });
      setProducts(Array.isArray(data) ? data : (data.products || []));
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, brandFilter, searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Reset variant size if category changes
    if (name === "category") {
      setVariantInput(prev => ({
        ...prev,
        size: CATEGORY_SIZES[value]?.[0] || ""
      }));
    }
  };

  const openAddModal = () => {
    setFormData({
      name: "",
      price: "",
      category: "T-Shirts",
      brand: "",
      material: "",
      images: [],
      description: "",
      variants: [],
    });
    setVariantInput({
      size: CATEGORY_SIZES["T-Shirts"][0],
      color: "",
      stock: 0
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setFormData({
      name: product.name || product.title || "",
      price: product.price || "",
      category: product.category || "T-Shirts",
      brand: product.brand || "",
      material: product.material || "",
      images: product.images || (product.image ? [product.image] : []),
      description: product.description || "",
      variants: product.variants || [],
    });
    setVariantInput({
      size: CATEGORY_SIZES[product.category || "T-Shirts"]?.[0] || "",
      color: "",
      stock: 0
    });
    setCurrentId(product._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await api.put(`/products/${currentId}`, formData);
      } else {
        await api.post("/products", formData);
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      alert("Error saving product");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return imagePath.startsWith("http")
      ? imagePath
      : `http://localhost:5001${imagePath}`;
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formDataUpload = new FormData();
    files.forEach(file => formDataUpload.append("images", file));

    try {
      const res = await api.post("/upload/multiple", formDataUpload);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...res.data.images],
      }));
    } catch (error) {
      console.error("Upload error", error);
      alert("Failed to upload images");
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addVariant = () => {
    if (!variantInput.color || !variantInput.size) {
      alert("Please enter both size and color");
      return;
    }
    
    // Check for duplicates
    const duplicate = formData.variants.find(v => v.size === variantInput.size && v.color.toLowerCase() === variantInput.color.toLowerCase());
    if (duplicate) {
      alert("This variant (size + color) already exists");
      return;
    }

    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, variantInput]
    }));
    setVariantInput({ size: CATEGORY_SIZES[formData.category]?.[0] || "", color: "", stock: 0 });
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const updateVariantStock = (index, newStock) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index].stock = parseInt(newStock) || 0;
    setFormData({ ...formData, variants: updatedVariants });
  };

  const calculateTotalStock = (p) => {
      if (!p.variants || p.variants.length === 0) return p.stock || 0;
      return p.variants.reduce((acc, v) => acc + v.stock, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter((p) => p._id !== id));
      } catch (error) {
        alert("Error deleting product");
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative">
                <i className="fa fa-search absolute left-3 top-2.5 text-gray-400"></i>
                <input 
                    type="text" 
                    placeholder="Search name/brand..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-48" 
                />
            </div>

            {/* Category Filter */}
            <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border p-2 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">All Categories</option>
                {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <button
              onClick={openAddModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition font-bold"
            >
              + Add Product
            </button>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 text-xs uppercase ls-1">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Variants</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                         <img
                          src={getImageUrl(product.images?.[0] || product.image)}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded shadow-sm border flex-shrink-0"
                        />
                        <div className="overflow-hidden">
                            <div className="font-bold text-gray-800 truncate" title={product.name || product.title}>{product.name || product.title}</div>
                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{product.brand}</div>
                        </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{product.category}</span>
                  </td>
                  <td className="p-4 text-gray-800 font-bold">{formatPrice(product.price)}</td>
                  <td className="p-4">
                     <div className="text-xs">
                        <div className="font-bold text-blue-600">{product.variants?.length || 0} Variants</div>
                        <div className="text-gray-400 mt-1 max-w-[150px] truncate">
                           {Array.from(new Set(product.variants?.map(v => v.size))).join(', ')}
                        </div>
                        <div className="text-gray-400 max-w-[150px] truncate small">
                           {Array.from(new Set(product.variants?.map(v => v.color))).join(', ')}
                        </div>
                     </div>
                  </td>
                  <td className="p-4">
                     <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${calculateTotalStock(product) > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-gray-700 font-medium">{calculateTotalStock(product)}</span>
                     </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <i className="fa fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded shadow-xl w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Slim Fit Denim" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Brand</label>
                    <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} required className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Levi's" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (₹)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border p-2 rounded">
                    {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Material</label>
                <input type="text" name="material" value={formData.material} onChange={handleInputChange} className="w-full border p-2 rounded" placeholder="e.g. 100% Cotton" />
              </div>

              {/* Variant Management */}
              <div className="border rounded-lg p-3 bg-gray-50">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Inventory Variants</label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                    <select value={variantInput.size} onChange={(e) => setVariantInput({...variantInput, size: e.target.value})} className="border p-2 rounded text-sm">
                      {(CATEGORY_SIZES[formData.category] || []).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input type="text" value={variantInput.color} onChange={(e) => setVariantInput({...variantInput, color: e.target.value})} placeholder="Color" className="border p-2 rounded text-sm col-span-1" />
                    <input type="number" value={variantInput.stock} onChange={(e) => setVariantInput({...variantInput, stock: parseInt(e.target.value)})} placeholder="Stock" className="border p-2 rounded text-sm" />
                    <button type="button" onClick={addVariant} className="bg-green-600 text-white rounded text-sm font-bold">Add</button>
                </div>
                <div className="space-y-2">
                   {formData.variants.map((v, i) => (
                     <div key={i} className="flex justify-between items-center bg-white p-2 rounded border shadow-sm text-sm">
                        <span>{v.size} / {v.color}</span>
                        <div className="flex items-center gap-2">
                           <input 
                             type="number" 
                             value={v.stock} 
                             onChange={(e) => updateVariantStock(i, e.target.value)} 
                             className="w-16 border rounded text-center font-bold text-blue-600 outline-none focus:border-blue-500"
                           />
                           <span className="text-[10px] text-gray-400 uppercase font-bold">Qty</span>
                           <button type="button" onClick={() => removeVariant(i)} className="text-red-500 hover:bg-red-50 p-1 rounded transition"><i className="fa fa-trash"></i></button>
                        </div>
                     </div>
                   ))}
                </div>
              </div>

              {/* Image Upload Gallery */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Image Gallery (Up to 5)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                   {formData.images.map((img, i) => (
                     <div key={i} className="relative group w-16 h-16">
                        <img src={getImageUrl(img)} className="w-full h-full object-cover rounded border shadow-sm" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition shadow">×</button>
                     </div>
                   ))}
                   {formData.images.length < 5 && (
                     <label className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-500 hover:text-blue-500 transition">
                        <i className="fa fa-plus text-xs"></i>
                        <span className="text-[10px] font-bold">Upload</span>
                        <input type="file" multiple onChange={handleImageUpload} className="hidden" />
                     </label>
                   )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  rows="3"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
