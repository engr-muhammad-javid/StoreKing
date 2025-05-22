import React from 'react';
import OrderRow from './OrderRow';

const Orders = () => {

    const orders = [
    {
      id: "0701255",
      time: "03:21 PM, 07-01-2025",
      products: "1 Product",
      status: "Pending",
      payment: "Unpaid",
      amount: "RD$31.83",
    },
    {
      id: "0701254",
      time: "03:21 PM, 07-01-2025",
      products: "1 Product",
      status: "Returned",
      payment: "Paid",
      amount: "RD$41.58",
    },
    {
      id: "0701253",
      time: "03:21 PM, 07-01-2025",
      products: "1 Product",
      status: "On The Way",
      payment: "Unpaid",
      amount: "RD$766.00",
    },
  ];

  return (
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-gray-50 text-left text-sm font-semibold text-gray-700">
                <tr>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Products</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Payment</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Action</th>
                </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {orders.map((order, index) => (
				<OrderRow order={order} index={index} />
            ))}
        </tbody>
    </table>
  );
};

export default Orders;
