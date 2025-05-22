import React from "react";
import Orders from "../../components/account/Orders";

const OrderHistory = () => {


  return (

      <div className="w-full">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Order History</h2>
        <div className="p-6 rounded-2xl shadow-card bg-white">
          <Orders />
          <div className="flex justify-between items-center mt-4 px-2">
              <span className="text-sm text-gray-500">Showing 1 to 3 of 5 results</span>
              <div className="flex items-center space-x-2">
                  <button className="px-4 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">Previous</button>
                  <button className="px-4 py-1 rounded-full bg-green-600 text-white">1</button>
                  <button className="px-4 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">2</button>
                  <button className="px-4 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">Next</button>
              </div>
          </div>
        </div>
    </div>
  );
};

export default OrderHistory;
