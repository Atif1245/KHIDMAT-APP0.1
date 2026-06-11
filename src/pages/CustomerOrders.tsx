import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Package, CheckCircle, XCircle, Clock, 
  Calendar, Navigation, AlertCircle
} from 'lucide-react';

interface Order {
  id: string;
  providerName: string;
  service: string;
  date: string;
  time: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  eta?: string;
  providerImage?: string;
}

const CustomerOrders: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'cancelled'>('active');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'KH-12345',
      providerName: 'Ali Raza',
      service: 'Plumbing Repair',
      date: 'Today',
      time: '6:00 PM',
      amount: 1800,
      status: 'in_progress',
      eta: '8 min',
      providerImage: 'https://ui-avatars.com/api/?name=Ali+Raza&background=005F54&color=fff'
    },
    {
      id: 'KH-12346',
      providerName: 'Bilal Ahmed',
      service: 'Electrical Repair',
      date: 'Today',
      time: '2:00 PM',
      amount: 1200,
      status: 'confirmed',
      eta: '15 min',
      providerImage: 'https://ui-avatars.com/api/?name=Bilal+Ahmed&background=005F54&color=fff'
    },
    {
      id: 'KH-12344',
      providerName: 'Sara Khan',
      service: 'AC Service',
      date: 'Yesterday',
      time: '2:00 PM',
      amount: 2500,
      status: 'completed',
      providerImage: 'https://ui-avatars.com/api/?name=Sara+Khan&background=005F54&color=fff'
    },
    {
      id: 'KH-12343',
      providerName: 'Usman Sheikh',
      service: 'Painting',
      date: '2 days ago',
      time: '11:00 AM',
      amount: 1200,
      status: 'cancelled',
      providerImage: 'https://ui-avatars.com/api/?name=Usman+Sheikh&background=005F54&color=fff'
    },
  ]);

  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed' || o.status === 'in_progress');
  const completedOrders = orders.filter(o => o.status === 'completed');
  const cancelledOrders = orders.filter(o => o.status === 'cancelled');

  const handleCancelOrder = () => {
    if (selectedOrderId) {
      setOrders(prev => prev.map(o => 
        o.id === selectedOrderId ? { ...o, status: 'cancelled' } : o
      ));
      setShowCancelConfirm(false);
      setSelectedOrderId(null);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch(status) {
      case 'in_progress': return { text: 'In Progress', color: 'bg-orange-100 text-orange-600', icon: Clock };
      case 'confirmed': return { text: 'Confirmed', color: 'bg-blue-100 text-blue-600', icon: CheckCircle };
      case 'pending': return { text: 'Pending', color: 'bg-yellow-100 text-yellow-600', icon: Clock };
      case 'completed': return { text: 'Completed', color: 'bg-green-100 text-green-600', icon: CheckCircle };
      case 'cancelled': return { text: 'Cancelled', color: 'bg-red-100 text-red-600', icon: XCircle };
      default: return { text: status, color: 'bg-gray-100 text-gray-600', icon: Clock };
    }
  };

  const OrderCard = ({ order }: { order: Order }) => {
    const badge = getStatusBadge(order.status);
    const Icon = badge.icon;
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex gap-3">
            <img src={order.providerImage} alt="" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h3 className="font-bold text-gray-800 dark:text-white">{order.providerName}</h3>
              <p className="text-sm text-gray-500">{order.service}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${badge.color} text-xs font-semibold`}>
            <Icon size={12} />
            <span>{badge.text}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
          <Calendar size={12} />
          <span>{order.date} at {order.time}</span>
        </div>
        
        {order.eta && order.status !== 'completed' && order.status !== 'cancelled' && (
          <div className="flex items-center gap-2 text-xs text-emerald-600 mt-1">
            <Navigation size={12} />
            <span>ETA: {order.eta}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div>
            <p className="text-xs text-gray-400">Total Amount</p>
            <p className="font-bold text-emerald-600">Rs {order.amount}</p>
          </div>
          <div className="flex gap-2">
            {(order.status === 'in_progress' || order.status === 'confirmed') && (
              <>
                <button 
                  onClick={() => navigate('/tracking')}
                  className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                >
                  Track Order
                </button>
                <button 
                  onClick={() => { setSelectedOrderId(order.id); setShowCancelConfirm(true); }}
                  className="border border-red-500 text-red-500 px-3 py-1.5 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
              </>
            )}
            {order.status === 'completed' && (
              <button className="border border-emerald-500 text-emerald-600 px-3 py-1.5 rounded-lg text-xs font-semibold">
                Reorder
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl">
            <ArrowLeft size={22} className="text-gray-700 dark:text-white" />
          </button>
          <h1 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 flex-1">My Orders</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition ${
              activeTab === 'active' ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Active ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition ${
              activeTab === 'completed' ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Completed ({completedOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition ${
              activeTab === 'cancelled' ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Cancelled ({cancelledOrders.length})
          </button>
        </div>

        {/* Orders List */}
        {activeTab === 'active' && activeOrders.map(order => <OrderCard key={order.id} order={order} />)}
        {activeTab === 'completed' && completedOrders.map(order => <OrderCard key={order.id} order={order} />)}
        {activeTab === 'cancelled' && cancelledOrders.map(order => <OrderCard key={order.id} order={order} />)}
        
        {activeTab === 'active' && activeOrders.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No active orders</p>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Cancel Order?</h3>
              <p className="text-gray-500 text-sm mb-6">Are you sure you want to cancel this order?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold"
                >
                  No, Keep
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;