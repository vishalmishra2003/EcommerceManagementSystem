import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom'
import { Login } from './Component/Login'
import { Registration } from './Component/Registration'
import { DashboardLayout } from './pages/DashboardLayout'
import { Admin } from './pages/Admin'
import { Customer } from './pages/Customer'
import { DeliveryPartner } from './pages/DeliveryPartner'
import { ProductDetails } from './Component/Customer/ProductDetails';
import { MyTrack } from './Component/Customer/MyTrack';
import { ErrorPage } from './pages/ErrorPage';
import { RequireAuth } from './Middleware/RequireAuth';
import { Order } from './Component/DeliveyPartner/Order';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/dashboard" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
        <Route path="admin" element={<Admin />} />
        <Route path="customer" element={<Customer />} />
        <Route path="track-order/:id" element={<MyTrack />} />
        <Route path="delivery-partner" element={<DeliveryPartner />} />
        <Route path='order' element={<Order />} />
      </Route>
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}

export default App