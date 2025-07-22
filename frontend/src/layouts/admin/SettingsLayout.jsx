import React from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { hasPermission } from '../../utils/permissions';

const SettingsLayout = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentPage = pathSegments[pathSegments.length - 1];

  const permissions = useSelector((state) => state.auth.permissions);

  const settingsMenu = [
    { name: 'Company', path: 'company' },
    { name: 'Site', path: 'site' },
    { name: 'Delivery Zones', path: 'delivery-zones' },
    { name: 'Mail', path: 'mail' },
    { name: 'OTP', path: 'otp' },
    { name: 'Notification', path: 'notification' },
    { name: 'Notification Alert', path: 'notification-alert' },
    { name: 'Social Media', path: 'social-media' },
    { name: 'Cookies', path: 'cookies' },
    { name: 'Theme', path: 'theme-settings' },
    { name: 'Sliders', path: 'sliders' },
    { name: 'Currencies', path: 'currencies' },
    { name: 'Product Categories', path: 'categories' },
    { name: 'Product Brands', path: 'brands' },
    { name: 'Product Units', path: 'units' },
    { name: 'Roles and Permissions', path: 'roles' },
    { name: 'Taxes', path: 'taxes' },
    { name: 'Product Attributes', path: 'product-attributes' },
    { name: 'Suppiers', path: 'suppliers' },
    { name: 'Outlets', path: 'outlets' },
    { name: 'Benefits', path: 'benefits' },
    { name: 'Pages', path: 'pages' },
    { name: 'Languages', path: 'languages' },
  ];

  // Filter only those items that user has view access for
  const allowedSettings = settingsMenu.filter((item) =>
    hasPermission(permissions, "settings/"+item.path, 'view')
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <ul className="space-y-2">
              {allowedSettings.map((item) => (
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
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
