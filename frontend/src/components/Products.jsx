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

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState(0);
  const [inStock, setInStock] = useState(false);

  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [showFilters, setShowFilters] = useState(false);

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
          let resProducts = Array.isArray(data) ? data : data.products || [];

          if (limit) resProducts = resProducts.slice(0, limit);

          const mappedData = resProducts.map((item) => ({
            ...item,
            id: item._id,
          }));

          setData(mappedData);
          setPage(data.page || 1);
          setPages(limit ? 1 : data.pages || 1);
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
    return () => {
      isMounted = false;
    };
  }, [debouncedKeyword, category, brand, size, color, minPrice, maxPrice, rating, inStock, sort, page]);

  const getImageUrl = (imagePath) =>
    imagePath?.startsWith("http") ? imagePath : `http://localhost:5001${imagePath}`;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        {loading ? (
          <Skeleton height={400} count={8} />
        ) : error ? (
          <div className="text-danger text-center">{error}</div>
        ) : (
          <div className="row g-4">
            {data.map((product) => (
              <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card border-0 shadow-sm">
                  <NavLink to={`/products/${product.id}`}>
                    <img src={getImageUrl(product.images?.[0])} className="img-fluid" />
                  </NavLink>

                  <div className="card-body">
                    <h6>{product.name}</h6>
                    <p>{formatPrice(product.price)}</p>

                    <button
                      onClick={() =>
                        isSignedIn ? toggleWishlist(product) : navigate("/login")
                      }
                    >
                      ❤
                    </button>

                    <NavLink to={`/products/${product.id}`} className="btn btn-dark w-100">
                      View
                    </NavLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;