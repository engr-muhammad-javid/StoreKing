import React from 'react'

export default function OrderRow({ order, index }) {

     const getStatusColor = (status) => {
        switch (status) {
          case "Pending":
            return "bg-yellow-100 text-yellow-600";
          case "Returned":
            return "bg-red-100 text-red-600";
          case "On The Way":
            return "bg-cyan-100 text-cyan-600";
          default:
            return "";
        }
      };
    
      const getPaymentColor = (payment) => {
        switch (payment) {
          case "Paid":
            return "bg-green-100 text-green-600";
          case "Unpaid":
            return "bg-red-100 text-red-600";
          default:
            return "";
        }
      };


  return (
     <tr key={index} className="border-b border-gray-100">
        <td className="px-6 py-4">
            <div className="font-medium">{order.id}</div>
            <div className="text-gray-400 text-xs">{order.time}</div>
        </td>
        <td className="px-6 py-4">{order.products}</td>
        <td className="px-6 py-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            {order.status}
            </span>
        </td>
        <td className="px-6 py-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentColor(order.payment)}`}>
            {order.payment}
            </span>
        </td>
        <td className="px-6 py-4">{order.amount}</td>
        <td className="px-6 py-4">
            <button className="bg-green-500 hover:bg-green-600 text-white rounded-full px-2 py-1 text-sm shadow">
            ...
            </button>
        </td>
        </tr>
  )
}
