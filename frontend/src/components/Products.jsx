import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { useAuth } from "@clerk/clerk-react";
import api from "../utils/api";

const Products = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
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
                        keyword,
                        category,
                        sort,
                        pageNumber: page,
                    },
                });
                if (isMounted) {
                    const resProducts = Array.isArray(data) ? data : (data.products || []);
                    const mappedData = resProducts.map((item) => ({
                        ...item,
                        id: item._id,
                    }));
                    setData(mappedData);
                    setPage(data.page);
                    setPages(data.pages);
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
    }, [keyword, category, sort, page, getToken]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "";
        return imagePath.startsWith("http")
            ? imagePath
            : `http://localhost:5001${imagePath}`;
    };

    const handleAddToCart = (product) => {
        if (isSignedIn) {
            addItem(product);
        } else {
            navigate("/login");
        }
    };

    return (
        <div className="container my-5 py-5">
            <div className="row">
                <div className="col-12 mb-5">
                    <h1 className="display-6 fw-bolder text-center">Latest Products</h1>
                    <hr />
                </div>
            </div>

            {/* Controls are always visible */}
            <div className="row mb-5 align-items-center">
                <div className="col-md-4 mb-3 mb-md-0">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search products..."
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={sort}
                        onChange={(e) => {
                            setSort(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="newest">Newest Arrivals</option>
                        <option value="priceLowHigh">Price: Low to High</option>
                        <option value="priceHighLow">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <div className="buttons d-flex justify-content-center mb-5 flex-wrap">
                <button className={`btn btn-outline-dark me-2 mb-2 ${category === '' ? 'active' : ''}`} onClick={() => { setCategory(''); setPage(1); }}>All</button>
                <button className={`btn btn-outline-dark me-2 mb-2 ${category === "men's clothing" ? 'active' : ''}`} onClick={() => { setCategory("men's clothing"); setPage(1); }}>Men's Clothing</button>
                <button className={`btn btn-outline-dark me-2 mb-2 ${category === "women's clothing" ? 'active' : ''}`} onClick={() => { setCategory("women's clothing"); setPage(1); }}>Women's Clothing</button>
                <button className={`btn btn-outline-dark me-2 mb-2 ${category === "jewelery" ? 'active' : ''}`} onClick={() => { setCategory("jewelery"); setPage(1); }}>Jewelery</button>
                <button className={`btn btn-outline-dark me-2 mb-2 ${category === "electronics" ? 'active' : ''}`} onClick={() => { setCategory("electronics"); setPage(1); }}>Electronics</button>
            </div>

            <div className="row justify-content-center">
                {loading ? (
                    <>
                        <div className="col-md-3"><Skeleton height={350} /></div>
                        <div className="col-md-3"><Skeleton height={350} /></div>
                        <div className="col-md-3"><Skeleton height={350} /></div>
                        <div className="col-md-3"><Skeleton height={350} /></div>
                    </>
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
                                    <div className="card h-100 text-center p-4">
                                        <img src={getImageUrl(product.image)} className="card-img-top" alt={product.title || product.name} height="250px" />
                                        <div className="card-body">
                                            <h5 className="card-title mb-0">{(product.title || product.name || 'Untitled').substring(0, 12)}...</h5>
                                            <p className="card-text lead fw-bold">${product.price}</p>
                                            <div className="d-flex justify-content-center gap-2">
                                                <NavLink to={`/products/${product.id}`} className="btn btn-outline-dark">Details</NavLink>
                                                <button className="btn btn-outline-dark" onClick={() => handleAddToCart(product)}><i className="fa fa-shopping-cart"></i></button>
                                                <button
                                                    className={`btn ${isInWishlist(product.id) ? 'btn-danger' : 'btn-outline-danger'}`}
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
