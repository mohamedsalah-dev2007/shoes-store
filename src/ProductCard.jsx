import React from 'react';

// استقبلنا الـ onAddToCart هنا
const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div style={styles.card}>
      <img src={product.image} alt={product.name} style={styles.image} />
      <h3 style={styles.title}>{product.name}</h3>
      <p style={styles.price}>{product.price} ج.م</p>
      {/* ضفنا حدث الـ onClick هنا */}
      <button style={styles.button} onClick={onAddToCart}>أضف إلى السلة</button>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #eee',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    direction: 'rtl'
  },
  image: {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  title: {
    fontSize: '18px',
    margin: '15px 0 10px 0',
    color: '#333',
    fontWeight: '600'
  },
  price: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#ff4757',
    marginBottom: '15px'
  },
  button: {
    backgroundColor: '#111',
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '14px',
    fontWeight: 'bold'
  }
};

export default ProductCard;