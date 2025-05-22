import React from 'react';

const StatCard = ({ icon: Icon, value, label, iconColor }) => (
  <div className="bg-white rounded-lg p-4 shadow-md flex items-center">
    <Icon className={`text-2xl mr-3 ${iconColor}`} />
    <div>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  </div>
);

export default StatCard;
