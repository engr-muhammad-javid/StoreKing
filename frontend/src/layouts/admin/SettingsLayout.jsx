import React from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom';

const SettingsLayout = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentPage = pathSegments[pathSegments.length - 1];

  // Menu items for settings section
  const settingsMenu = [
    { name: 'Company', path: 'company' },
    { name: 'Site', path: 'site' },
    { name: 'Delivery Zones', path: 'delivery-zones' },
    { name: 'Mail', path: 'mail' },
    { name: 'OTP', path: 'otp' },
    { name: 'Notification', path: 'notification' },
    { name: 'Notification Alert', path: 'notification-alert' },
    { name: 'Social Media', path: 'social-media' },
    { name: 'Sliders', path: 'sliders' },
    { name: 'Currencies', path: 'currencies' },
    { name: 'Product Categories', path: 'categories' },
    { name: 'Product Brands', path: 'brands' },
    { name: 'Product Units', path: 'units' },
    { name: 'Taxes', path: 'taxes' },
    { name: 'Product Attributes', path: 'attributes' },
  ];

  const additionalActions = [
    { name: 'Delivery Boys', path: 'delivery-boys' },
    { name: 'Customers', path: 'customers' },
    { name: 'Employees', path: 'employees' },
    { name: 'Accounts', path: 'accounts' },
    { name: 'Transactions', path: 'transactions' },
    { name: 'Reports', path: 'reports' },
    { name: 'Sales Report', path: 'sales-report' },
    { name: 'Products Report', path: 'products-report' },
    { name: 'Credit Balance Report', path: 'credit-balance-report' },
    { name: 'Setup', path: 'setup' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Settings Sidebar */}
        <div className="w-64 flex-shrink-0 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <ul className="space-y-2">
              {settingsMenu.map((item) => (
                <li key={item.path}>
                  <Link
                    to={`/admin/settings/${item.path}`}
                    className={`block px-3 py-2 rounded ${
                      currentPage === item.path ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="font-semibold text-lg mb-4">Additional Actions</h2>
            <ul className="space-y-2">
              {additionalActions.map((item) => (
                <li key={item.path}>
                  <Link
                    to={`/admin/settings/${item.path}`}
                    className="block px-3 py-2 rounded hover:bg-gray-100"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;