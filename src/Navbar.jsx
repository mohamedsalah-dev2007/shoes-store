import React from 'react';

const Navbar = ({ cartCount, onCartClick, onCategoryChange }) => {
  return (
    <nav style={styles.navbar}>
      <div onClick={() => onCategoryChange('All')} style={styles.logo}>
        SoleStyle
      </div>
      <ul style={styles.navLinks}>
        <li style={styles.link} onClick={() => onCategoryChange('All')}>الرئيسية</li>
        <li style={styles.link} onClick={() => onCategoryChange('Men')}>رجالي</li>
        <li style={styles.link} onClick={() => onCategoryChange('Women')}>حريمي</li>
        <li style={styles.link} onClick={() => onCategoryChange('Kids')}>أطفال</li>
      </ul>
      <div style={styles.cartIcon} onClick={onCartClick}>
        🛒 <span style={styles.cartCount}>{cartCount}</span>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#111',
    color: '#fff',
    direction: 'rtl'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ff4757',
    cursor: 'pointer'
  },
  navLinks: {
    display: 'flex',
    listStyle: 'none',
    gap: '20px',
    margin: 0,
    padding: 0
  },
  link: {
    cursor: 'pointer',
    fontSize: '16px'
  },
  cartIcon: {
    fontSize: '20px',
    cursor: 'pointer',
    position: 'relative'
  },
  cartCount: {
    position: 'absolute',
    top: '-8px',
    right: '-10px',
    backgroundColor: '#ff4757',
    color: '#fff',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '12px'
  }
};

export default Navbar;