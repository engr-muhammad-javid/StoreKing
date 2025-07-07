import React, { useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PageHeader from '../../../components/admin/PageHeader';
import { Table, CrudModal, ConfirmationDialog, ActionButtons, ReactPaginate } from '../../../components/common';
import { 
  fetchCategories,
  deleteCategory, 
  resetCategoryState
} from '../../../store/slices/categorySlice';
import { openModal, closeModal } from '../../../store/slices/modalSlice';


const Categories = () => {

  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector(state => state.category);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  const columns = [
      { key: 'name', header: 'Name' },
    
      { 
		key: 'parent._id', 
		header: 'Parent Category',
		render: (item) => item.parent?.name || 'N/A', 
	
	},
      {
        key: 'isActive',
        header: 'Status',
        render: (item) => (
          <span
            className={`px-3 py-1 text-xs rounded-full font-semibold ${
              item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {item.isActive ? 'Active' : 'Inactive'}
          </span>
        ),
      },
    ];
  
    const handleAdd = () => {
      setConfirmOpen(false);
      dispatch(closeModal());
      dispatch(openModal({ entity: 'category', mode: 'add' }));
    };
  

  const handleEdit = (category) => {
      setConfirmOpen(false);
      dispatch(closeModal());
      dispatch(openModal({ entity: 'category', mode: 'edit', initialData: category }));
    };
  
  const handleDelete = (id) => {
    dispatch(closeModal());
    setDeletingCategoryId(id);
    setConfirmOpen(true);
  };


  const confirmDelete = async () => {
      if (!deletingCategoryId) {
        setConfirmOpen(false);
        return;
      }
      try {
        const result = await dispatch(deleteCategory(deletingCategoryId));
        if (deleteCategory.fulfilled.match(result)) {
          toast.success('Category deleted successfully!');
          const newTotalPages = Math.ceil((categories.length - 1) / itemsPerPage);
          if (page >= newTotalPages && page > 0) {
            setPage(newTotalPages - 1);
          }
        } else {
          toast.error(error || 'Failed to delete Category');
        }
      } catch (err) {
        toast.error('An error occurred: ' + err.message);
      } finally {
        setDeletingCategoryId(null);
        setConfirmOpen(false);
      }
    };

	useEffect(() => {
		dispatch(fetchCategories());
		setConfirmOpen(false);
		return () => {
		dispatch(resetCategoryState());
		};
	}, [dispatch]);

	useEffect(() => {
		if (error) {
		toast.error(error);
		dispatch(resetCategoryState());
		}
	}, [error, dispatch]);

    const paginatedCategories = categories.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
	const totalPages = Math.ceil(categories.length / itemsPerPage);

	const handlePageChange = ({ selected }) => {
		setPage(selected);
	};
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
		<PageHeader title="Product Categories" onAdd={handleAdd} />
    
      <Table
        columns={columns}
        data={paginatedCategories}
        loading={loading.fetch || loading.delete}
        emptyMessage="No products found."
        renderRowActions={(item) => (
          <ActionButtons
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item._id)}
          />
        )}
      />

     {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'...'}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            containerClassName={'flex gap-2 items-center'}
            pageClassName={'px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100'}
            activeClassName={'bg-blue-600 text-white border-blue-600'}
            previousClassName={'px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100'}
            nextClassName={'px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100'}
            disabledClassName={'opacity-50 cursor-not-allowed'}
            breakClassName={'px-3 py-1'}
          />
        </div>
      )}

	  <CrudModal />

	  <ConfirmationDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this category?"
      />


    </div>
  );
};

export default Categories;