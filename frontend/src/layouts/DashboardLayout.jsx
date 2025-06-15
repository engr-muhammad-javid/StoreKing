import React from 'react';
import Header from '../components/admin/Header';
import Sidebar from '../components/admin/Sidebar';
import { useLocation, Link, Outlet } from 'react-router-dom';


const DashboardLayout = () => {
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const toCamelCaseWithCapital = (str) => {
      return str
        .toLowerCase()
        .split(/[-_ ]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
    };

  return (
    
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-600 mb-6">
            {pathSegments.map((segment, index) => (

                
                
              <React.Fragment key={segment}>
                
                <Link
                  to={`/${pathSegments.slice(0, index + 1).join('/')}`}
                  className={`${index === pathSegments.length - 1 ? 'text-blue-600' : 'font-medium hover:text-blue-500'}`}
                >
                {toCamelCaseWithCapital(segment)}
                </Link>
                {index < pathSegments.length - 1 && <span className="mx-2">/</span>}
              </React.Fragment>
            ))}
          </div>


          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;