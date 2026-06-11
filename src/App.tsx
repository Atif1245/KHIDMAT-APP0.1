import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Sidebar from './components/Sidebar';
import SplashScreen from './pages/SplashScreen';
import RoleSelection from './pages/RoleSelection';
import CustomerSignin from './pages/CustomerSignin';
import CustomerSignup from './pages/CustomerSignup';
import CustomerHome from './pages/CustomerHome';
import ProviderDashboard from './pages/ProviderDashboard';
import ProviderProfile from './pages/ProviderProfile';
import BookingFlow from './pages/BookingFlow';
import LiveTracking from './pages/LiveTracking';
import ProviderJobs from './pages/ProviderJobs';
import ProviderEarnings from './pages/ProviderEarnings';
import ProviderCalendar from './pages/ProviderCalendar';
import SearchScreen from './pages/SearchScreen';
import CustomerOrders from './pages/CustomerOrders';
import CustomerChats from './pages/CustomerChats';
import ContactUs from './pages/ContactUs';
import HelpCenter from './pages/HelpCenter';


function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Sidebar />
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/customer-signin" element={<CustomerSignin />} />
          <Route path="/customer-signup" element={<CustomerSignup />} />
          <Route path="/customer-home" element={<CustomerHome />} />
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/provider-profile" element={<ProviderProfile />} />
          <Route path="/booking" element={<BookingFlow />} />
          <Route path="/tracking" element={<LiveTracking />} />
          <Route path="/provider-jobs" element={<ProviderJobs />} />
          <Route path="/provider-earnings" element={<ProviderEarnings />} />
          <Route path="/provider-calendar" element={<ProviderCalendar />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/customer-orders" element={<CustomerOrders />} />
          <Route path="/customer-chats" element={<CustomerChats />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/help-center" element={<HelpCenter />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
