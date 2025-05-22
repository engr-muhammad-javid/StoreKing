import React from 'react';
import StatsGrid from '../../components/account/StatsGrid';
import Orders from '../../components/account/Orders';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";

const Overview = () => {
  const {user} = useSelector((state) => state.auth);

  return (
      <div className="right-panel px-6 py-4 w-full">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p className="mb-4">Welcome Back, <strong>{user?.name}!</strong></p>

        {/* Stats */}
        <StatsGrid />
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-xl font-bold capitalize">Order History</h4>
            <Link  to="/account/order-history" className="py-2 px-4 text-sm sm:py-2.5 sm:px-5 rounded-3xl capitalize sm:text-base font-semibold whitespace-nowrap text-green-500 transition-all duration-300 hover:bg-green-500 hover:text-white">Show Full History</Link>
          </div>
          {/* Order History */}
          <Orders />
      </div>
  );
};

export default Overview;
