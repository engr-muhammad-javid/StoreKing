import React from 'react';
import { FaShoppingBag, FaCheckCircle, FaRedo, FaWallet } from 'react-icons/fa';
import StatCard from './StatCard';

const StatsGrid = () => {
  const stats = [
    { icon: FaShoppingBag, value: 6, label: 'Total Orders', iconColor: 'text-blue-500' },
    { icon: FaCheckCircle, value: 3, label: 'Total Completed', iconColor: 'text-green-500' },
    { icon: FaRedo, value: 1, label: 'Total Returned', iconColor: 'text-purple-500' },
    { icon: FaWallet, value: 'RD$0.00', label: 'Wallet Balance', iconColor: 'text-blue-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          value={stat.value}
          label={stat.label}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
};

export default StatsGrid;
