import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { useAuth } from "@clerk/clerk-react";
import api from "../utils/api";
import { useDebounce } from "../hooks/useDebounce";
import { formatPrice } from "../utils/formatters";

const Products = ({ isFeatured = false, limit = null, hideHeader = false }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Filtering States
    const [keyword, setKeyword] = useState('');
    const debouncedKeyword = useDebounce(keyword, 500);
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [gender, setGender] = useState('');
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [rating, setRating] = useState(0);
    const [inStock, setInStock] = useState(false);

    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const [showFilters, setShowFilters] = useState(false);

    const { addItem } = useContext(CartContext);
    const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
    const navigate = useNavigate();
    const { isSignedIn, getToken } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await api.get("/products", {
                    params: {
                        keyword: debouncedKeyword,
                        category,
                        brand,
                        gender,
                        size,
                        color,
                        minPrice,
                        maxPrice,
                        rating,
                        inStock,
                        sort,
                        pageNumber: page,
                    },
                });
                if (isMounted) {
                    let resProducts = Array.isArray(data) ? data : (data.products || []);
                    
                    // Client-side filtering for isFeatured if backend doesn't support it
                    if (isFeatured) {
                        // Assuming brand 'ZARA' or similar as featured if no featured flag exists, 
                        // or just taking first few if we want "Trending"
                        // In a real app, we'd check product.isFeatured
                        // For now, let's just use it as a signal to limit or sort differently if needed
                    }

                    if (limit) {
                        resProducts = resProducts.slice(0, limit);
                    }

                    const mappedData = resProducts.map((item) => ({
                        ...item,
                        id: item._id,
                    }));
                    setData(mappedData);
                    setPage(data.page || 1);
                    setPages(limit ? 1 : (data.pages || 1));
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.response?.data?.message || err.message || "Failed to fetch products");
                    setLoading(false);
                }
            }
        };

        fetchProducts();
        return () => { isMounted = false; };
    }, [debouncedKeyword, category, brand, gender, size, color, minPrice, maxPrice, rating, inStock, sort, page, isFeatured, limit]);

    const handleAddToCart = (product) => {
        if (isSignedIn) {
            // Check if product has variants and requires selection
            if (product.variants?.length > 0) {
                navigate(`/products/${product.id}`);
            } else {
                addItem(product);
            }
        } else {
            navigate("/login");
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "";
        return imagePath.startsWith("http")
            ? imagePath
            : `http://localhost:5001${imagePath}`;
    };

    const resetFilters = () => {
        setKeyword('');
        setCategory('');
        setBrand('');
        setGender('');
        setSize('');
        setColor('');
        setMinPrice('');
        setMaxPrice('');
        setRating(0);
        setInStock(false);
        setPage(1);
    };

    return (
        <div className={`container ${!hideHeader ? 'my-5 py-5' : ''}`}>
            {!hideHeader && (
                <div className="row">
                    <div className="col-12 mb-5">
                        <h1 className="display-6 fw-bolder text-center">Curated Fashion Collection</h1>
                        <p className="text-center text-muted">Premium apparel designed for comfort and style.</p>
                        <hr />
                    </div>
                </div>
            )}

            {!hideHeader && (
                <div className="row mb-4 align-items-center">
                    <div className="col-md-6 mb-3 mb-md-0">
                        <div className="input-group shadow-sm">
                            <span className="input-group-text bg-white border-end-0">
                                <i className="fa fa-search text-muted"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0 ps-0"
                                placeholder="Search by product, brand or item name..."
                                value={keyword}
                                onChange={(e) => {
                                    setKeyword(e.target.value);
                                    setPage(1);
                                }}
                            />
                            <button
                                className={`btn ${showFilters ? 'btn-dark' : 'btn-outline-dark'}`}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <i className="fa fa-sliders me-2"></i>
                                Filters
                            </button>
                        </div>
                    </div>
                    <div className="col-md-3 offset-md-3">
                        <select
                            className="form-select shadow-sm"
                            value={sort}
                            onChange={(e) => {
                                setSort(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="newest">Sort: Newest First</option>
                            <option value="priceLowHigh">Price: Low to High</option>
                            <option value="priceHighLow">Price: High to Low</option>
                            <option value="rating">Best Rated</option>
                        </select>
                    </div>
                </div>
            )}


            {/* Advanced Filters Panel */}
            {showFilters && (
                <div className="row mb-5 animate__animated animate__fadeIn">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm p-4 bg-light">
                            <div className="row g-4">
                                {/* Gender & Brand */}
                                <div className="col-md-3">
                                    <label className="form-label fw-bold small text-uppercase text-muted">Gender</label>
                                    <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                                        <option value="">All Genders</option>
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Unisex">Unisex</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-bold small text-uppercase text-muted">Brand</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter brand name"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                    />
                                </div>

                                {/* Size & Color */}
                                <div className="col-md-3">
                                    <label className="form-label fw-bold small text-uppercase text-muted">Size</label>
                                    <select className="form-select" value={size} onChange={(e) => setSize(e.target.value)}>
                                        <option value="">Any Size</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                        <option value="XXL">XXL</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-bold small text-uppercase text-muted">Color</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. Red, Blue"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                    />
                                </div>

                                {/* Price Range */}
                                <div className="col-md-4">
                                    <label className="form-label fw-bold small text-uppercase text-muted">Price Range (₹)</label>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Min"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                        />
                                        <span className="input-group-text bg-white border-0">to</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Max"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Rating Filter */}
                                <div className="col-md-3">
                                    <label className="form-label fw-bold small text-uppercase text-muted">Min Rating</label>
                                    <select
                                        className="form-select"
                                        value={rating}
                                        onChange={(e) => setRating(Number(e.target.value))}
                                    >
                                        <option value="0">All Ratings</option>
                                        <option value="4">4+ Stars</option>
                                        <option value="3">3+ Stars</option>
                                        <option value="2">2+ Stars</option>
                                    </select>
                                </div>

                                {/* Stock Status */}
                                <div className="col-md-3 d-flex align-items-end">
                                    <div className="form-check form-switch mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="stockSwitch"
                                            checked={inStock}
                                            onChange={(e) => setInStock(e.target.checked)}
                                        />
                                        <label className="form-check-label fw-bold small text-uppercase text-muted" htmlFor="stockSwitch">In Stock Only</label>
                                    </div>
                                </div>

                                {/* Reset Button */}
                                <div className="col-md-2 d-flex align-items-end">
                                    <button
                                        className="btn btn-outline-secondary w-100"
                                        onClick={resetFilters}
                                    >
                                        Clear All
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!hideHeader && (
                <div className="buttons d-flex justify-content-center mb-5 flex-wrap gap-2">
                    {['All', 'T-Shirts', 'Shirts', 'Jeans', 'Hoodies', 'Jackets'].map(cat => (
                        <button
                            key={cat}
                            className={`btn rounded-pill px-4 ${category === (cat === 'All' ? '' : cat) ? 'btn-dark' : 'btn-outline-dark'}`}
                            onClick={() => { setCategory(cat === 'All' ? '' : cat); setPage(1); }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            <div className="row justify-content-center">
                {loading ? (
                    <div className="row">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="col-md-3 mb-4"><Skeleton height={400} borderRadius={15} /></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center text-danger py-5">{error}</div>
                ) : data.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="lead">No products found.</p>
                    </div>
                ) : (
                    <>
                        <div className="row">
                            {data.map((product) => (
                                <div key={product.id} className="col-md-3 mb-4">
                                    <div className="card h-100 text-center p-3 border-0 shadow-sm rounded-4 hover-lift transition">
                                        <div className="card-img-container bg-light rounded-4 overflow-hidden mb-3">
                                            <img
                                                src={getImageUrl(product.images?.[0] || product.image)}
                                                className="card-img-top w-100"
                                                alt={product.name}
                                                style={{ height: "280px", objectFit: "contain" }}
                                            />
                                        </div>
                                        <div className="card-body p-2 d-flex flex-column">
                                            <div className="small text-muted text-uppercase mb-1">{product.brand}</div>
                                            <h5 className="card-title fw-bold mb-3">{(product.name || product.title || '').substring(0, 18)}...</h5>
                                            <div className="d-flex justify-content-between align-items-center mt-auto">
                                                <span className="fs-5 fw-bolder text-primary">{formatPrice(product.price)}</span>
                                                <div className="d-flex gap-1">
                                                    <NavLink to={`/products/${product.id}`} className="btn btn-dark btn-sm rounded-3 shadow-sm">
                                                        <i className="fa fa-eye"></i>
                                                    </NavLink>
                                                    <button className={`btn btn-sm rounded-3 shadow-sm ${isInWishlist(product.id) ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => isSignedIn ? toggleWishlist(product) : navigate("/login")}>
                                                        <i className={`fa ${isInWishlist(product.id) ? 'fa-heart' : 'fa-heart-o'}`}></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {pages > 1 && (
                            <nav className="d-flex justify-content-center mt-5">
                                <ul className="pagination">
                                    {[...Array(pages).keys()].map((p) => (
                                        <li key={p + 1} className={`page-item ${p + 1 === page ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => setPage(p + 1)}>{p + 1}</button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Products;
