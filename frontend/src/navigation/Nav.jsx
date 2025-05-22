import React, { useState } from "react";
import { navbar } from "./css/navigation";
import { Link } from "react-router-dom";
import DropdownMenu from "./DropdownMenu";
import { DropdownMenuData } from "../utils/menu";

function Nav() {
  const [count, setCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false); // <-- New state

  return (
    <div className="flex justify-between items-center px-2 py-4 relative border-t border-gray-100">
      <div className="flex items-center">
        {/* Clickable menu */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown((prev) => !prev)} // toggle dropdown
            className="bg-slate-900 p-3 rounded-md text-white text-sm font-semibold"
          >
            <i className="fa-solid fa-table-cells-large mr-2"></i>
            Browse Category
            <i className="ml-1 fa-solid fa-angle-down"></i>
          </button>

          {showDropdown && (
            <div className="absolute z-50">
              <DropdownMenu data={DropdownMenuData} />
            </div>
          )}
        </div>

        <ul className="flex justify-between items-center ml-3">
          <li>
            <Link className={navbar.navLink} to="/">Home</Link>
          </li>
          <li>
            <Link className={navbar.navLink} to="/offers">Offer</Link>
          </li>
          <li>
            <Link className={navbar.navLink} to="/daily-deals">Daily Deal</Link>
          </li>
          <li>
            <Link className={navbar.navLink} to="/flashSale">Flash Sale</Link>
          </li>
        </ul>
      </div>

      <div>
        <button
          className="text-blue-900 text-base mr-4 font-semibold"
          onClick={() => alert("contact us")}
        >
          <i className="fa-solid fa-headset"></i> +92 300 1234567
        </button>

        <button
          onClick={() => setCount(count + 1)}
          className="bg-green-500 font-semibold py-2 px-3 text-white rounded-lg"
        >
          <i className="fa-solid fa-bag-shopping mr-2"></i> My Cart {`( ${count} )`}
        </button>
      </div>
    </div>
  );
}

export default Nav;
