import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiShoppingBag, FiPackage, FiDollarSign } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import Loader from '../components/Loader';

export default function AdminDashboard() {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token || user?.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const [ordersRes, usersRes, productsRes] = await Promise.all([
          api.get('/orders/all'),
          api.get('/users'),
          api.get('/products')
        ]);

        const orders = ordersRes.data;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.isPaid ? order.total : 0), 0);

        setStats({
          totalOrders: orders.length,
          totalRevenue,
          totalUsers: usersRes.data.length,
          totalProducts: productsRes.data.total || 0,
          recentOrders: orders.slice(0, 5)
        });
      } catch (err) {
        console.error('Error fetching admin stats', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [token, user, navigate]);

  if (isLoading) return <Loader fullScreen />;
  if (!stats) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold text-brand-dark mb-8">Painel Administrativo</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 border border-brand-gray shadow-sm flex items-center shadow-lg">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4">
            <FiDollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Faturamento</p>
            <p className="text-2xl font-bold text-brand-charcoal">R$ {stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 border border-brand-gray shadow-sm flex items-center shadow-lg">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-4">
            <FiShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pedidos</p>
            <p className="text-2xl font-bold text-brand-charcoal">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="bg-white p-6 border border-brand-gray shadow-sm flex items-center shadow-lg">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-4">
            <FiPackage className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Produtos</p>
            <p className="text-2xl font-bold text-brand-charcoal">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="bg-white p-6 border border-brand-gray shadow-sm flex items-center shadow-lg">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mr-4">
            <FiUsers className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Clientes</p>
            <p className="text-2xl font-bold text-brand-charcoal">{stats.totalUsers}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-brand-gray shadow-sm">
        <div className="px-6 py-4 border-b border-brand-gray flex justify-between items-center">
          <h2 className="text-lg font-bold font-serif uppercase tracking-widest text-brand-dark">Pedidos Recentes</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-gray text-gray-600 font-medium uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">ID do Pedido</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-brand font-medium">{order._id.substring(0, 8)}...</td>
                  <td className="px-6 py-4">{order.user?.name || 'Usuário Excluído'}</td>
                  <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 text-brand-charcoal font-medium">R$ {order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-sm uppercase tracking-wider ${
                      order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {order.isPaid ? 'Pago' : 'Pendente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {stats.recentOrders.length === 0 && (
            <div className="p-8 text-center text-gray-500">Nenhum pedido encontrado.</div>
          )}
        </div>
      </div>
    </div>
  );
}
