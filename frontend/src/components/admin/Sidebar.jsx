import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaBox, FaShoppingCart, FaExclamationTriangle, FaWarehouse, 
  FaCashRegister, FaClipboardList, FaShoppingBag, FaUndo 
} from 'react-icons/fa';

const SidebarItem = ({ to, icon, text }) => (
  <li>
    <NavLink 
      to={to}
      className={({ isActive }) => 
        `flex items-center space-x-2 p-2 rounded hover:bg-gray-100 ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-gray-900'}`
      }
    >
      <span className="text-gray-500">{icon}</span>
      <span>{text}</span>
    </NavLink>
  </li>
);

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-sm sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
        
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">DASHBOARD</h3>
          <ul className="space-y-1">
            <SidebarItem to="/admin/dashboard" icon={<FaBox />} text="Dashboard" />
          </ul>
        </div>


        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">PRODUCT & STOCK</h3>
          <ul className="space-y-1">
            <SidebarItem to="/admin/products" icon={<FaBox />} text="Products" />
            <SidebarItem to="/purchase" icon={<FaShoppingCart />} text="Purchase" />
            <SidebarItem to="/damages" icon={<FaExclamationTriangle />} text="Damages" />
            <SidebarItem to="/stock" icon={<FaWarehouse />} text="Stock" />
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">POS & ORDERS</h3>
          <ul className="space-y-1">
            <SidebarItem to="/pos" icon={<FaCashRegister />} text="POS" />
            <SidebarItem to="/orders" icon={<FaClipboardList />} text="POS Orders" />
            <SidebarItem to="/online-orders" icon={<FaShoppingBag />} text="Online Orders" />
            <SidebarItem to="/return-orders" icon={<FaUndo />} text="Return Orders" />
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">SETUP</h3>
          <ul className="space-y-1">
            <SidebarItem to="/admin/settings" icon={<FaCashRegister />} text="Settings" />
          </ul>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;