import React, { useState, useEffect} from 'react';
import { FaPlus } from 'react-icons/fa';
import Form from '../../../components/admin/settings/delivery-zone/Form';
import Row from '../../../components/admin/settings/delivery-zone/Row';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'; 

import { 
  fetchdeliveryZones, 
  createdeliveryZone, 
  updatedeliveryZone,
  resetdeliveryZoneState,
  clearCurrentdeliveryZone
} from '../../../store/slices/deliveryZoneSlice';

const deliveryZones = () => {

  const dispatch = useDispatch();
  const { deliveryZones, loading } = useSelector(state => state.deliveryZone);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingdeliveryZone, setEditingdeliveryZone] = useState(null);
 

  const handleAdd = () => {
        setEditingdeliveryZone(null);
        setModalOpen(true);
  };

  const handleEdit = (deliveryZone) => {
        setEditingdeliveryZone(deliveryZone);
        setModalOpen(true);
  };


  const handleSubmit = async (data) => {
    const action = editingdeliveryZone
    ? updatedeliveryZone({ data, id: editingdeliveryZone._id })
    : createdeliveryZone(data);

    try{
        const result = await dispatch(action);
        if(result.meta.requestStatus === 'rejected'){
            toast.error(result.payload || `Failed to ${editingdeliveryZone ? "update" : "create"} deliveryZone`);
        }else{
            toast.success(result.payload.message || `Delivery Zone ${editingdeliveryZone ? "updated" : "created"} successfully`);
            dispatch(fetchdeliveryZones());
            setModalOpen(false);
            dispatch(clearCurrentdeliveryZone());
        }
    }catch(error){
        toast.error("An error occurred: " + error.message);
    }
  };

  useEffect(() => {
    dispatch(fetchdeliveryZones());
    return () => {
      dispatch(resetdeliveryZoneState());
    };
  }, [dispatch]);

 
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Delivery Zones</h2>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <FaPlus /> Add New
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading deliveryZones...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Address</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
                {deliveryZones.length === 0 ? (
                <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                        No deliveryZones found.
                    </td>
                    </tr>
                ) : ( 
                    deliveryZones.map((deliveryZone) => (

                        <Row
                            key={deliveryZone._id}
                            fullData={deliveryZone}
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
        initialData={editingdeliveryZone}
        mode={editingdeliveryZone ? 'edit' : 'add'}
      />
    </div>
  );
};

export default deliveryZones;