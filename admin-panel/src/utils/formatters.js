/**
 * Formats a numeric price into a localized Indian Rupee string.
 * Example: 1499 -> ₹1,499
 * @param {number|string} price - The price value to format
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    if (isNaN(numericPrice)) return '₹0';

    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numericPrice);
};
