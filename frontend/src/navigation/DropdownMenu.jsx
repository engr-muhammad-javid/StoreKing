import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

const DropdownMenu = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) return null;

  return (
    <ul className="absolute left-0 top-full bg-white shadow-md mt-1 rounded z-50 min-w-[200px]">
      {data.map((item, index) => {
        const hasChildren = item.children && item.children.length > 0;

        return (
          <li
            key={index}
            className="relative hover:bg-gray-100"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link
              to={item.url}
              className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              <span>{item.name}</span>
              {hasChildren && (
                <ChevronRightIcon className="w-4 h-4 text-gray-500 ml-2" />
              )}
            </Link>

            {hasChildren && hoveredIndex === index && (
              <div className="absolute left-full top-0 z-50">
                <DropdownMenu data={item.children} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default DropdownMenu;
