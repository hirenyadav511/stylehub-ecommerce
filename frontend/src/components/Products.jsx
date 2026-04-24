import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { WishlistContext } from "../context/WishlistContext";
import { useAuth } from "@clerk/clerk-react";
import api from "../utils/api";
import { useDebounce } from "../hooks/useDebounce";
import { formatPrice } from "../utils/formatters";

const Products = ({ limit = null }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [keyword, setKeyword] = useState("");
    const debouncedKeyword = useDebounce(keyword, 500);

    const [category] = useState("");
    const [sort] = useState("newest");
    const [page] = useState(1);

    const { toggleWishlist } = useContext(WishlistContext);
    const navigate = useNavigate();
    const { isSignedIn } = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const { data } = await api.get("/products", {
                    params: {
                        keyword: debouncedKeyword,
                        category,
                        sort,
                        pageNumber: page,
                    },
                });

                let products = Array.isArray(data) ? data : data.products || [];

                if (limit) products = products.slice(0, limit);

                setData(products.map((p) => ({ ...p, id: p._id })));
                setLoading(false);
            } catch (err) {
                setError(err.message || "Error fetching products");
                setLoading(false);
            }
        };
        fetchProducts();
    }, [debouncedKeyword, category, sort, page, limit]);

    const getImageUrl = (img) =>
        img?.startsWith("http") ? img : `http://localhost:5001${img}`;

    return (
        <div className="container py-4">

            <input
                className="form-control mb-4"
                placeholder="Search products..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />

            {loading ? (
                <Skeleton count={6} height={300} />
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <div className="row g-4">

                    {data.map((product) => (
                        <div key={product.id} className="col-6 col-md-3">

                            <div className="border p-2">

                                <NavLink to={`/products/${product.id}`}>
                                    <img
                                        src={getImageUrl(product.images?.[0])}
                                        className="img-fluid"
                                        alt={product.name}
                                    />
                                </NavLink>

                                <h6 className="mt-2">{product.name}</h6>

                                <p>{formatPrice(product.price)}</p>

                                <button
                                    className="btn btn-dark w-100"
                                    onClick={() =>
                                        isSignedIn ? toggleWishlist(product) : navigate("/login")
                                    }
                                >
                                    Wishlist
                                </button>

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
};

export default Products;