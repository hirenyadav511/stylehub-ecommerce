import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { useAuth } from "@clerk/clerk-react";
import api from "../utils/api";
import { useDebounce } from "../hooks/useDebounce";
import { formatPrice } from "../utils/formatters";
import { PRODUCT_CATEGORIES } from "../utils/constants";


const Products = ({ isFeatured = false, limit = null, hideHeader = false }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Filtering States
    const [keyword, setKeyword] = useState('');
    const debouncedKeyword = useDebounce(keyword, 500);
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
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
    const { isSignedIn } = useAuth();

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
    }, [debouncedKeyword, category, brand, size, color, minPrice, maxPrice, rating, inStock, sort, page, isFeatured, limit]);

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
        setSize('');
        setColor('');
        setMinPrice('');
        setMaxPrice('');
        setRating(0);
        setInStock(false);
        setPage(1);
    };

    return (
        <div className={`container ${!hideHeader ? 'py-5' : ''}`}>
            {!hideHeader && (
                <div className="row section-padding pb-0">
                    <div className="col-12 text-center mb-5">
                        <h6 className="text-muted text-uppercase tracking-widest mb-2">Exclusive Selection</h6>
                        <h2 className="text-uppercase fw-bold display-5">Our Collection</h2>
                        <div className="mx-auto bg-dark" style={{ width: '60px', height: '2px' }}></div>
                    </div>
                </div>
            )}

            {!hideHeader && (
                <div className="row mb-5 g-4">
                    {/* Category Tabs - Centered */}
                    <div className="col-12 text-center mb-4">
                        <div className="d-flex justify-content-center gap-2 flex-wrap">
                            {['All', ...PRODUCT_CATEGORIES].map(cat => (

                                <button
                                    key={cat}
                                    className={`btn btn-sm ${category === (cat === 'All' ? '' : cat) ? 'btn-dark' : 'btn-outline-dark'}`}
                                    style={{ padding: '0.6rem 1.5rem', minWidth: '100px' }}
                                    onClick={() => { setCategory(cat === 'All' ? '' : cat); setPage(1); }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search, Filter Toggle, and Sort - Balanced Row */}
                    <div className="col-12">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 py-3 border-top border-bottom">
                            <div className="d-flex gap-2 align-items-center w-100" style={{ maxWidth: '450px' }}>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0">
                                        <i className="fa fa-search text-muted"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0 ps-0"
                                        placeholder="SEARCH OUR COLLECTION..."
                                        value={keyword}
                                        onChange={(e) => {
                                            setKeyword(e.target.value);
                                            setPage(1);
                                        }}
                                    />
                                </div>
                                <button
                                    className={`btn ${showFilters ? 'btn-dark' : 'btn-outline-dark'} text-nowrap`}
                                    onClick={() => setShowFilters(!showFilters)}
                                    style={{ padding: '0.65rem 1.25rem' }}
                                >
                                    <i className="fa fa-sliders me-2"></i>
                                    FILTERS
                                </button>
                            </div>

                            <div className="d-flex align-items-center gap-3">
                                <span className="text-muted small text-uppercase tracking-widest d-none d-lg-block">Sort By:</span>
                                <select
                                    className="form-select border-0 bg-light w-auto"
                                    style={{ cursor: 'pointer', paddingRight: '2.5rem' }}
                                    value={sort}
                                    onChange={(e) => {
                                        setSort(e.target.value);
                                        setPage(1);
                                    }}
                                >
                                    <option value="newest">NEWEST FIRST</option>
                                    <option value="priceLowHigh">PRICE: LOW TO HIGH</option>
                                    <option value="priceHighLow">PRICE: HIGH TO LOW</option>
                                    <option value="rating">BEST RATED</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showFilters && (
                <div className="row mb-5">
                    <div className="col-12">
                        <div className="p-4 bg-light">
                            <div className="row g-4">
                                    <div className="col-md-3">
                                    <label className="small fw-bold text-uppercase mb-2 d-block">Price (₹)</label>
                                    <div className="d-flex gap-2">
                                        <input type="number" className="form-control" placeholder="MIN" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                                        <input type="number" className="form-control" placeholder="MAX" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex align-items-end">
                                    <button className="btn btn-dark w-100" onClick={resetFilters}>RESET ALL</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="row justify-content-center">
                {loading ? (
                    <div className="row g-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="col-12 col-sm-6 col-md-4 col-lg-3"><Skeleton height={400} /></div>
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
                        <div className="row g-4 px-2">
                            {data.map((product) => (
                                <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                    <div className="card h-100 border-0 shadow-sm-hover">
                                        <NavLink to={`/products/${product.id}`} className="card-img-container d-block">
                                            <img
                                                src={getImageUrl(product.images?.[0] || product.image)}
                                                alt={product.name}
                                                className="img-fluid"
                                            />
                                        </NavLink>
                                        <div className="card-body p-3">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div className="overflow-hidden">
                                                    <small className="text-muted text-uppercase fw-bold tracking-tighter d-block mb-1" style={{ fontSize: '0.65rem' }}>{product.brand}</small>
                                                    <h6 className="card-title text-uppercase mb-1" style={{ fontSize: '0.85rem' }}>
                                                        <NavLink to={`/products/${product.id}`} className="text-dark">{(product.name || product.title || '').substring(0, 18)}</NavLink>
                                                    </h6>
                                                    <div className="card-price text-dark">{formatPrice(product.price)}</div>
                                                </div>
                                                <button 
                                                    className="btn p-1 border-0 bg-transparent" 
                                                    onClick={() => isSignedIn ? toggleWishlist(product) : navigate("/login")}
                                                >
                                                    <i className={`fa ${isInWishlist(product.id) ? 'fa-heart text-danger' : 'fa-heart-o text-muted'}`} style={{ fontSize: '1.1rem' }}></i>
                                                </button>
                                            </div>
                                            <NavLink to={`/products/${product.id}`} className="btn btn-outline-dark btn-sm w-100 py-2 mt-2" style={{ fontSize: '0.7rem' }}>
                                                VIEW DETAILS
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {pages > 1 && !limit && (
                            <nav className="d-flex justify-content-center mt-5">
                                <ul className="pagination">
                                    {[...Array(pages).keys()].map((p) => (
                                        <li key={p + 1} className={`page-item ${p + 1 === page ? 'active' : ''}`}>
                                            <button 
                                                className="page-link border-dark text-dark rounded-0 px-3 py-2" 
                                                style={{ backgroundColor: p + 1 === page ? '#000' : '#fff', color: p + 1 === page ? '#fff' : '#000' }}
                                                onClick={() => setPage(p + 1)}
                                            >
                                                {p + 1}
                                            </button>
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
