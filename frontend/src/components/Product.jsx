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

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewFit, setReviewFit] = useState("Perfect");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(null);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      getproduct();
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
        <div className="col-md-6"><Skeleton height={600} /></div>
        <div className="col-md-6">
          <Skeleton height={40} width={200} className="mb-4" />
          <Skeleton height={60} width="100%" className="mb-4" />
          <Skeleton height={30} width={150} className="mb-4" />
          <Skeleton height={200} width="100%" />
        </div>
      </div>
    );
  };

  const ShowProduct = () => {
    const sizes = [...new Set(product.variants?.map(v => v.size) || [])];
    const colors = [...new Set(product.variants?.map(v => v.color) || [])];
    const currentVariant = product.variants?.find(v => v.size === selectedSize && v.color === selectedColor);
    const isOutOfStock = !currentVariant || currentVariant.stock === 0;

    return (
      <div className="row g-5">
        <div className="col-md-7">
          <div className="sticky-md-top" style={{ top: "100px" }}>
            <div className="mb-3 bg-light overflow-hidden product-detail-img-container">
              <img
                src={getImageUrl(activeImage)}
                alt={product.name}
                className="w-100 h-100 object-fit-contain product-detail-img"
              />
            </div>
            <div className="d-flex gap-2 overflow-auto pb-2">
              {(product.images?.length > 0 ? product.images : [product.image]).map((img, idx) => (
                <div
                  key={idx}
                  className={`cursor-pointer border ${activeImage === img ? 'border-dark' : 'border-transparent'}`}
                  style={{ width: "80px", height: "100px", flexShrink: 0 }}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={getImageUrl(img)} className="w-100 h-100 object-fit-cover" alt={`thumb-${idx}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="ps-md-4">
            <span className="text-muted text-uppercase tracking-widest small">{product.brand}</span>
            <h1 className="text-uppercase fw-bold mt-2 mb-3">{product.name}</h1>

            <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-4">
              <div className="d-flex align-items-center gap-1 text-dark">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fa ${i < Math.floor(product.averageRating || 0) ? 'fa-star' : 'fa-star-o'} small`}></i>
                ))}
                <span className="fw-bold ms-2 mt-1 small">{product.averageRating?.toFixed(1) || 0}</span>
              </div>
              <span className="text-muted small">({product.numReviews || 0} REVIEWS)</span>
            </div>

            <div className="mb-5">
              <h2 className="fw-bold mb-1">{formatPrice(product.price)}</h2>
              <p className="text-muted small text-uppercase tracking-wider">Tax included. Free shipping on orders over ₹10,000.</p>
            </div>

            <p className="text-secondary mb-5" style={{ whiteSpace: "pre-wrap", fontSize: '0.95rem' }}>{product.description}</p>

            <div className="mb-5 border-top pt-5">
              <div className="mb-4">
                <label className="fw-bold text-uppercase small tracking-widest mb-3 d-block">Select Size</label>
                <div className="d-flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      className={`btn px-4 py-2 ${selectedSize === size ? 'btn-dark' : 'btn-outline-dark'}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="fw-bold text-uppercase small tracking-widest mb-3 d-block">Select Color</label>
                <div className="d-flex flex-wrap gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      className={`btn px-4 py-2 ${selectedColor === color ? 'btn-dark' : 'btn-outline-dark'}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 small text-uppercase tracking-widest">
                <span className={isOutOfStock ? 'text-danger' : 'text-success'}>
                  {isOutOfStock ? "SOLD OUT" : "IN STOCK"}
                </span>
              </div>
            </div>

            <div className="d-flex gap-2 mb-5">
              <button
                className="btn btn-dark flex-grow-1 py-4"
                disabled={isOutOfStock}
                onClick={() => handleAddToCart(product)}
              >
                {isOutOfStock ? "SOLD OUT" : "ADD TO SHOPPING BAG"}
              </button>
              <button
                className={`btn px-4 border ${isInWishlist(product.id) ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => isSignedIn ? toggleWishlist(product) : navigate("/login")}
              >
                <i className={`fa ${isInWishlist(product.id) ? 'fa-heart' : 'fa-heart-o'}`}></i>
              </button>
            </div>

            <div className="border-top pt-4 row g-3 text-center">
              <div className="col-4">
                <i className="fa fa-truck d-block mb-2 text-muted"></i>
                <small className="text-uppercase tracking-tighter" style={{ fontSize: '0.65rem' }}>FAST SHIPPING</small>
              </div>
              <div className="col-4">
                <i className="fa fa-undo d-block mb-2 text-muted"></i>
                <small className="text-uppercase tracking-tighter" style={{ fontSize: '0.65rem' }}>EASY RETURNS</small>
              </div>
              <div className="col-4">
                <i className="fa fa-shield d-block mb-2 text-muted"></i>
                <small className="text-uppercase tracking-tighter" style={{ fontSize: '0.65rem' }}>SECURE CHECKOUT</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-5 section-padding">
      {loading ? <Loading /> : error ? <div className="text-center text-danger py-5">{error}</div> : <ShowProduct />}
    </div>
  );
};

export default Product;
