import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import UserProfile from './components/auth/UserProfile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetails from './pages/ProductDetails';
import Favorites from './pages/Favorites';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';
import Layout from './components/layout/Layout';
import Categories from './pages/Categories';
import Brands from './pages/Brands';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<LoginForm />} />
                <Route path="register" element={<RegisterForm />} />
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />
                <Route path="produtos" element={<Products />} />
                <Route path="produtos/:id" element={<ProductDetails />} />
                <Route path="carrinho" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route
                  path="favoritos"
                  element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="pedidos"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route path="categorias" element={<Categories />} />
                <Route path="marcas" element={<Brands />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
