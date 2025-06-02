import React, { useState, useEffect} from 'react';
import { FaPlus } from 'react-icons/fa';
import Form from '../../../components/admin/settings/unit/Form';
import Row from '../../../components/admin/settings/unit/Row';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'; 

import { 
  fetchUnits, 
  createUnit, 
  updateUnit,
  resetUnitState,
  clearCurrentUnit
} from '../../../store/slices/unitSlice';

const Units = () => {

    const dispatch = useDispatch();
    const { units, loading } = useSelector(state => state.unit);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState(null);
 

    const handleAdd = () => {
        setEditingUnit(null);
        setModalOpen(true);
    };

    const handleEdit = (brand) => {
        setEditingUnit(brand);
        setModalOpen(true);
    };


    const handleSubmit = async (data) => {
      
        const action = editingUnit
        ? updateUnit({ data, id: editingUnit._id })
        : createUnit(data);

        try{
            const result = await dispatch(action);
            if(result.meta.requestStatus === 'rejected'){
                toast.error(result.payload || `Failed to ${editingUnit ? "update" : "create"} brand`);
            }else{
                toast.success(result.payload.message || `Unit ${editingUnit ? "updated" : "created"} successfully`);
                dispatch(fetchUnits());
                setModalOpen(false);
                dispatch(clearCurrentUnit());
            }
        }catch(error){
            toast.error("An error occurred: " + error.message);
        }
    };

    useEffect(() => {
        dispatch(fetchUnits());
        return () => {
            dispatch(resetUnitState());
        };
  }, [dispatch]);

 
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Units</h2>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <FaPlus /> Add New
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading Units...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Code</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
                {units.length === 0 ? (
                <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                        No units found.
                    </td>
                    </tr>
                ) : ( 
                    units.map((unit) => (

                        <Row
                            key={unit._id}
                            fullData={unit}
                            onEdit={handleEdit}
                        />
                        ))
                    )}

            </tbody>
          </table>
        </div>
      )}
      <Form
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingUnit}
        mode={editingUnit ? 'edit' : 'add'}
      />
    </div>
  );
};

export default Units;