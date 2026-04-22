import React, { useState, useEffect, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { NavLink, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import api, { setAuthToken } from "../utils/api";
import { formatPrice } from "../utils/formatters";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  // Review states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewFit, setReviewFit] = useState("Perfect");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(null);

  // Clothing Variant States
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImage, setActiveImage] = useState("");

  const { addItem } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return imagePath.startsWith("http")
      ? imagePath
      : `http://localhost:5001${imagePath}`;
  };

  const getproduct = async () => {
    setloading(true);
    setError(null);
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct({ ...data, id: data._id });
      // Set default variants and active image
      if (data.variants && data.variants.length > 0) {
        setSelectedSize(data.variants[0].size);
        setSelectedColor(data.variants[0].color);
      }
      setActiveImage(data.images?.[0] || data.image);
      setloading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch product");
      setloading(false);
    }
  };

  useEffect(() => {
    getproduct();
  }, [id]);

  const handleAddToCart = (product) => {
    if (isSignedIn) {
      if (!selectedSize || !selectedColor) {
        alert("Please select a size and color");
        return;
      }
      addItem(product, selectedSize, selectedColor);
    } else {
      navigate("/login");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      navigate("/login");
      return;
    }
    
    setReviewLoading(true);
    setReviewSuccess(null);
    try {
      const token = await getToken();
      setAuthToken(token);
      await api.post(`/products/${id}/review`, {
        rating: reviewRating,
        comment: reviewComment,
        fit: reviewFit,
        username: user.firstName || user.fullName || "Anonymous"
      });
      setReviewSuccess("Review submitted successfully!");
      setReviewComment("");
      getproduct(); // Refresh product data
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error submitting review");
    } finally {
      setReviewLoading(false);
    }
  };

  const Loading = () => {
    return (
      <div className="row py-4">
        <div className="col-md-6" style={{ lineHeight: 2 }}>
          <Skeleton height={500} width="100%" />
        </div>
        <div className="col-md-6">
          <Skeleton height={40} width={200} className="mb-2" />
          <Skeleton height={60} width="100%" className="mb-4" />
          <Skeleton height={30} width={150} className="mb-4" />
          <Skeleton height={80} width="100%" className="mb-4" />
          <Skeleton height={200} width="100%" />
        </div>
      </div>
    );
  };

  const ShowProduct = () => {
    // Helper to get unique values for selection
    const sizes = [...new Set(product.variants?.map(v => v.size) || [])];
    const colors = [...new Set(product.variants?.map(v => v.color) || [])];
    
    const currentVariant = product.variants?.find(v => v.size === selectedSize && v.color === selectedColor);
    const isOutOfStock = !currentVariant || currentVariant.stock === 0;

    return (
      <>
        <div className="row g-5 py-4">
          <div className="col-md-6">
            <div className="sticky-md-top" style={{ top: "100px" }}>
              <div className="product-image-main mb-3 rounded-4 overflow-hidden bg-light shadow-sm">
                 <img
                  src={getImageUrl(activeImage)}
                  alt={product.name}
                  className="img-fluid w-100"
                  style={{ height: "600px", objectFit: "contain" }}
                />
              </div>
              <div className="product-thumbnails d-flex gap-2 overflow-auto pb-2">
                {(product.images?.length > 0 ? product.images : [product.image]).map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`thumbnail-item rounded-3 overflow-hidden cursor-pointer border-2 border ${activeImage === img ? 'border-dark shadow-sm' : 'border-transparent'}`}
                    style={{ width: "80px", height: "80px", flexShrink: 0, cursor: "pointer" }}
                    onClick={() => setActiveImage(img)}
                  >
                    <img src={getImageUrl(img)} className="w-100 h-100 object-fit-cover" alt={`thumb-${idx}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="ps-md-4">
              <span className="text-muted text-uppercase fw-bold ls-1 small">{product.brand}</span>
              <h1 className="display-5 fw-bold text-gray-900 mt-2 mb-3">{product.name}</h1>
              
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="d-flex align-items-center gap-1 text-warning">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fa ${i < Math.floor(product.averageRating || 0) ? 'fa-star' : 'fa-star-o'}`}></i>
                  ))}
                  <span className="text-dark fw-bold ms-2 mt-1">{product.averageRating?.toFixed(1) || 0}</span>
                </div>
                <div className="vr text-muted opacity-25"></div>
                <span className="text-muted small">{product.numReviews || 0} customer reviews</span>
              </div>

              <div className="mb-4">
                 <h2 className="display-6 fw-bold text-primary mb-1">{formatPrice(product.price)}</h2>
                 <p className="text-muted small">Tax included. Free shipping on orders over ₹10,000.</p>
              </div>

              <p className="text-secondary fs-5 mb-5" style={{ whiteSpace: "pre-wrap" }}>{product.description}</p>
              
              {/* Product Specs */}
              <div className="row mb-5 g-4">
                <div className="col-6">
                   <div className="small text-muted text-uppercase fw-bold mb-1">Category</div>
                   <div className="fw-semibold text-dark">{product.category}</div>
                </div>
                <div className="col-6">
                   <div className="small text-muted text-uppercase fw-bold mb-1">Gender</div>
                   <div className="fw-semibold text-dark">{product.gender}</div>
                </div>
                <div className="col-12">
                   <div className="small text-muted text-uppercase fw-bold mb-1">Material</div>
                   <div className="fw-semibold text-dark">{product.material}</div>
                </div>
              </div>

              {/* Variant Selection */}
              <div className="variant-selection border-top pt-5 mb-5">
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <label className="fw-bold text-dark text-uppercase small ls-1">Size: <span className="text-muted fw-normal ms-1">{selectedSize}</span></label>
                    <button className="btn btn-link btn-sm p-0 text-decoration-none text-muted small">Size Guide</button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {sizes.map(size => (
                      <button 
                        key={size}
                        className={`btn rounded-3 px-4 py-2 fw-semibold transition ${selectedSize === size ? 'btn-dark' : 'btn-outline-dark'}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="fw-bold text-dark text-uppercase small ls-1 mb-3">Color: <span className="text-muted fw-normal ms-1">{selectedColor}</span></label>
                  <div className="d-flex flex-wrap gap-2">
                    {colors.map(color => (
                      <button 
                        key={color}
                        className={`btn rounded-3 px-4 py-2 fw-semibold transition ${selectedColor === color ? 'btn-dark' : 'btn-outline-dark'}`}
                        onClick={() => setSelectedColor(color)}
                        style={{ minWidth: "100px" }}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Variant Stock Info */}
                <div className="mt-4 p-3 rounded-3 bg-light d-inline-flex align-items-center">
                   <div className={`status-dot me-2 ${isOutOfStock ? 'bg-danger' : 'bg-success'}`} style={{ width: "10px", height: "10px", borderRadius: "50%" }}></div>
                   <span className={`fw-bold small ${isOutOfStock ? 'text-danger' : 'text-success'}`}>
                     {isOutOfStock ? "Out of Stock" : `In Stock (${currentVariant.stock} available)`}
                   </span>
                </div>
              </div>

              <div className="d-flex gap-2 mb-5">
                <button
                  className="btn btn-dark btn-lg flex-grow-1 py-3 rounded-4 fw-bold shadow-sm"
                  disabled={isOutOfStock}
                  onClick={() => handleAddToCart(product)}
                >
                  <i className="fa fa-shopping-bag me-2"></i> {isOutOfStock ? "Sold Out" : "Add to Shopping Bag"}
                </button>
                <button
                  className={`btn btn-lg rounded-4 px-4 shadow-sm transition ${isInWishlist(product.id) ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={() => {
                    if (isSignedIn) {
                      toggleWishlist(product);
                    } else {
                      navigate("/login");
                    }
                  }}
                >
                  <i className={`fa ${isInWishlist(product.id) ? 'fa-heart' : 'fa-heart-o'}`}></i>
                </button>
              </div>

              {/* Guarantees */}
              <div className="row g-4 pt-4 border-top">
                 <div className="col-4 text-center">
                    <i className="fa fa-truck fa-2x text-muted mb-2"></i>
                    <div className="small fw-bold">Fast Delivery</div>
                 </div>
                 <div className="col-4 text-center">
                    <i className="fa fa-undo fa-2x text-muted mb-2"></i>
                    <div className="small fw-bold">Easy Returns</div>
                 </div>
                 <div className="col-4 text-center">
                    <i className="fa fa-shield fa-2x text-muted mb-2"></i>
                    <div className="small fw-bold">Secure Payment</div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="row mt-5 pt-5 border-top">
          <div className="col-md-7">
            <h3 className="mb-4 fw-bold">Customer Reviews</h3>
            {product.reviews && product.reviews.length > 0 ? (
              <div className="review-list">
                {product.reviews.map((review, index) => (
                  <div key={index} className="card mb-3 border-0 bg-light p-3 shadow-sm rounded">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold text-dark">{review.username}</span>
                      <span className="text-muted small">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="d-flex align-items-center gap-3 mb-2">
                       <div>
                         {[...Array(5)].map((_, i) => (
                           <i key={i} className={`fa ${i < review.rating ? 'fa-star text-warning' : 'fa-star-o text-muted'}`}></i>
                         ))}
                       </div>
                       <span className={`badge ${review.fit === 'Perfect' ? 'bg-success' : 'bg-warning text-dark'}`}>
                         Fit: {review.fit}
                       </span>
                    </div>
                    <p className="mb-0 text-secondary">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info">No reviews yet. Be the first to review this product!</div>
            )}
          </div>
          
          <div className="col-md-5">
            <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: "100px" }}>
              <h3 className="mb-3 fw-bold">Write a Review</h3>
              {isSignedIn ? (
                <form onSubmit={handleReviewSubmit}>
                  {reviewSuccess && <div className="alert alert-success">{reviewSuccess}</div>}
                  <div className="mb-3">
                    <label className="form-label">Rating</label>
                    <select 
                      className="form-select"
                      value={reviewRating}
                      onChange={(e) => setReviewRating(e.target.value)}
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Very Good</option>
                      <option value="3">3 - Good</option>
                      <option value="2">2 - Fair</option>
                      <option value="1">1 - Poor</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">How does it fit?</label>
                    <div className="d-flex gap-2">
                       {['Tight', 'Perfect', 'Loose'].map(f => (
                         <button 
                           key={f}
                           type="button"
                           className={`btn btn-sm ${reviewFit === f ? 'btn-dark' : 'btn-outline-dark'}`}
                           onClick={() => setReviewFit(f)}
                         >
                           {f}
                         </button>
                       ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Your Comment</label>
                    <textarea 
                      className="form-control"
                      rows="4"
                      required
                      placeholder="Sharing your experience helps other shoppers..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-dark w-100 py-2 fw-bold"
                    disabled={reviewLoading}
                  >
                    {reviewLoading ? "Submitting..." : "Post Review"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">You must be logged in to post a review.</p>
                  <NavLink to="/login" className="btn btn-outline-dark px-4">Login Now</NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="bg-white">
      <div className="container py-5">
        {loading ? <Loading /> : error ? <div className="text-center text-danger py-5">{error}</div> : <ShowProduct />}
      </div>
    </div>
  );
};

export default Product;
