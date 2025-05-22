import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { FlashSaleData } from "../../utils/flash-sale.js";
import ProductCard from '../../components/ProductCard.jsx';

function FlashSale() {

  const [currentPage, setCurrentPage] = useState(0);
    const productsPerPage = 12;
  
    const pageCount = Math.ceil(FlashSaleData.length / productsPerPage);
    const offset = currentPage * productsPerPage;
    const currentProducts = FlashSaleData.slice(offset, offset + productsPerPage);
  
    const handlePageClick = ({ selected }) => {
      setCurrentPage(selected);
    };

    return (
      <section className="mb-20">
      <div className="container">
        <div className="flex items-center justify-between gap-5 mb-6 max-md:mb-8">
          <div className="flex flex-wrap items-end gap-3 max-md:flex-col max-md:items-start max-md:gap-1.5">
            <h3 className="text-3xl font-bold capitalize max-sm:text-lg">Flash Sale Products</h3>
            <span className="text-xl font-medium capitalize max-sm:text-sm">
              ({currentProducts.length} Products Found)
            </span>
          </div>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 velmld-parent'>
          {currentProducts.map((item, index) => (
            <ProductCard key={index} item={item} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-10">
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"flex items-center gap-2"}
            previousLinkClassName={"px-3 py-1 border rounded hover:bg-gray-200"}
            nextLinkClassName={"px-3 py-1 border rounded hover:bg-gray-200"}
            pageLinkClassName={"px-3 py-1 border rounded hover:bg-gray-200"}
            activeLinkClassName={"bg-black text-white"}
            disabledClassName={"opacity-50 pointer-events-none"}
          />
        </div>
      </div>
    </section>
    );
  };
  
  export default FlashSale;