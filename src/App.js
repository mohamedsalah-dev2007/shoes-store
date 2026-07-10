import React, { useState } from 'react';
import Navbar from './Navbar.jsx';
import ProductCard from './ProductCard.jsx';
import productsData from './products.json';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // States جديدة لإدارة الفاتورة
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState(null);

  const addToCart = (product) => {
    const exist = cartItems.find((item) => item.id === product.id);
    if (exist) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...exist, quantity: exist.quantity + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  };

  // لوجيك إنشاء الفاتورة والباركود
  const handleCheckout = () => {
    const orderNumber = Math.floor(100000 + Math.random() * 900000); // رقم عشوائي من 6 أرقام
    const currentDate = new Date().toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

   // نص الفاتورة متوافق مع قارئ الباركود تماماً وبدون مشاكل في التحميل
    const qrText = encodeURIComponent(`Invoice_No:${orderNumber}_Total:${totalPrice}_SoleStyle`);
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrText}`;
    setInvoiceDetails({
      orderNumber,
      date: currentDate,
      items: [...cartItems],
      total: totalPrice,
      qrCode: qrImageUrl
    });

    setShowInvoice(true);
    setCartItems([]); // تفريغ السلة بعد الشراء
  };

  const filteredProducts = productsData.filter((product) => {
    const matchesCategory = category === 'All' || product.category === category;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', paddingBottom: '40px', direction: 'rtl' }}>
      <Navbar 
        cartCount={totalItems} 
        onCartClick={() => { setShowCart(!showCart); setShowInvoice(false); }} 
        onCategoryChange={(cat) => { setCategory(cat); setSearchTerm(''); setShowCart(false); setShowInvoice(false); }} 
      />
      
      {showInvoice ? (
        /* واجهة الفاتورة بالباركود */
        <div style={styles.invoiceContainer}>
          <div style={styles.invoiceHeader}>
            <h2 style={{ color: '#ff4757', margin: 0 }}>SoleStyle Invoice</h2>
            <p>فاتورة شراء رقم: <strong>#{invoiceDetails.orderNumber}</strong></p>
            <p>التاريخ: {invoiceDetails.date}</p>
          </div>
          
          <table style={styles.invoiceTable}>
            <thead>
              <tr style={{ backgroundColor: '#f1f1f1' }}>
                <th style={styles.thtd}>المنتج</th>
                <th style={styles.thtd}>الكمية</th>
                <th style={styles.thtd}>السعر</th>
              </tr>
            </thead>
            <tbody>
              {invoiceDetails.items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={styles.thtd}>{item.name}</td>
                  <td style={styles.thtd}>{item.quantity}</td>
                  <td style={styles.thtd}>{item.price} ج.م</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.invoiceFooter}>
            <h3>الإجمالي النهائي: {invoiceDetails.total} ج.م</h3>
            <div style={styles.qrWrapper}>
              <img src={invoiceDetails.qrCode} alt="QR Code الفاتورة" style={styles.qrImage} />
              <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>امسح الكود للتحقق من الفاتورة 📱</p>
            </div>
          </div>

          <button onClick={() => setShowInvoice(false)} style={styles.backButton}>
            العودة للتسوق وإغلاق الفاتورة ←
          </button>
        </div>
      ) : !showCart ? (
        <div>
          <h1 style={{ textAlign: 'center', margin: '40px 0 10px 0', fontSize: '28px', color: '#111' }}>
            {category === 'All' && 'أحدث الموديلات العالمية 👟'}
            {category === 'Men' && 'قسم الرجالي 👟'}
            {category === 'Women' && 'قسم الحريمي 👗'}
            {category === 'Kids' && 'قسم الأطفال 🧸'}
          </h1>

          <div style={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="ابحث عن حذائك المفضل هنا... 🔍" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          
          <div style={styles.productsGrid}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} />
              ))
            ) : (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', fontSize: '18px', color: '#666', marginTop: '20px' }}>
                عذراً، لم نجد أي أحذية تطابق بحثك! 🔍
              </p>
            )}
          </div>
        </div>
      ) : (
        <div style={styles.cartContainer}>
          <h2>سلة المشتريات 🛒</h2>
          {cartItems.length === 0 ? (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>السلة فارغة حالياً، ابدأ بالتسوق!</p>
          ) : (
            <div>
              {cartItems.map((item) => (
                <div key={item.id} style={styles.cartItem}>
                  <img src={item.image} alt={item.name} style={styles.cartItemImage} />
                  <div style={styles.cartItemDetails}>
                    <h4>{item.name}</h4>
                    <p>{item.price} ج.م × {item.quantity}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={styles.deleteButton}>
                    حذف
                  </button>
                </div>
              ))}
              <hr />
              <div style={styles.totalSection}>
                <h3>الإجمالي: {totalPrice} ج.م</h3>
                <button style={styles.checkoutButton} onClick={handleCheckout}>
                  تأكيد الطلب
                </button>
              </div>
            </div>
          )}
          <button onClick={() => setShowCart(false)} style={styles.backButton}>
            العودة للمتجر ←
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: '0 auto 30px auto',
    maxWidth: '500px',
    padding: '0 20px'
  },
  searchInput: {
    width: '100%',
    padding: '12px 20px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '25px',
    outline: 'none',
    textAlign: 'right'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '25px',
    padding: '0 30px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  cartContainer: {
    maxWidth: '600px',
    margin: '40px auto',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15px 0',
    borderBottom: '1px solid #eee'
  },
  cartItemImage: {
    width: '70px',
    height: '70px',
    objectFit: 'cover',
    borderRadius: '6px'
  },
  cartItemDetails: {
    flex: 1,
    marginRight: '20px',
    textAlign: 'right'
  },
  deleteButton: {
    backgroundColor: '#ff4757',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  totalSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px'
  },
  checkoutButton: {
    backgroundColor: '#2ed573',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  backButton: {
    backgroundColor: '#fff',
    color: '#111',
    border: '1px solid #111',
    padding: '10px 20px',
    borderRadius: '6px',
    marginTop: '20px',
    cursor: 'pointer',
    width: '100%'
  },
  /* ستايلات الفاتورة الجديدة */
  invoiceContainer: {
    maxWidth: '600px',
    margin: '40px auto',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    borderTop: '8px solid #ff4757'
  },
  invoiceHeader: {
    textAlign: 'center',
    marginBottom: '20px',
    borderBottom: '2px dashed #eee',
    paddingBottom: '15px'
  },
  invoiceTable: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'right',
    marginBottom: '20px'
  },
  thtd: {
    padding: '10px',
    borderBottom: '1px solid #eee'
  },
  invoiceFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '8px'
  },
  qrWrapper: {
    textAlign: 'center'
  },
  qrImage: {
    width: '120px',
    height: '120px',
    border: '1px solid #eee',
    padding: '5px',
    backgroundColor: '#fff'
  }
};

export default App;