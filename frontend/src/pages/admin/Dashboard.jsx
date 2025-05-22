import React from 'react';
import { FaChartLine, FaShoppingBag, FaUsers, FaBox } from 'react-icons/fa';
import StatCard from '../../components/admin/StatCard';

const Dashboard = () => {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Good Evening!</h2>
        <p className="text-gray-600">John Doe</p>
      </div>

      <h3 className="text-xl font-semibold mb-4">Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Earnings" value="$12,345" icon={<FaChartLine className="text-blue-500" />} />
        <StatCard title="Total Orders" value="245" icon={<FaShoppingBag className="text-green-500" />} />
        <StatCard title="Total Customers" value="128" icon={<FaUsers className="text-purple-500" />} />
        <StatCard title="Total Products" value="56" icon={<FaBox className="text-orange-500" />} />
      </div>
    </>
  );
};

export default Dashboard;