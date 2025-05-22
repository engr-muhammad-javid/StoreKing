import React , { useState } from 'react'
import AddressCard from '../../components/account/AddressCard'
import AddAddressModal from '../../components/account/AddressModal';
import { updateAddress, createAddress } from "../../store/slices/authSlice";
import { toast } from 'react-toastify'; 
import {FaPlus } from 'react-icons/fa';
import { useSelector, useDispatch} from "react-redux";


function Addresses() {

    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.auth);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    const handleAdd = () => {
        setEditingAddress(null);
        setModalOpen(true);
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        setModalOpen(true);
    };


    const handleSubmit = async (data) => {
        if (editingAddress) {
            try {
       
                const result = await dispatch(updateAddress(data));
       
                if (updateAddress.rejected.match(result)) {
                    toast.error(result.payload || "Address Not Updated");
                } else {
                    toast.success(result.payload.message || "Address Updated successfully!");
                }
       
           } catch (error) {
             toast.error("Failed to update Address: " + error.message);
           }


        } else {
            try {
       
                const result = await dispatch(createAddress(data));
       
                if (createAddress.rejected.match(result)) {
                    toast.error(result.payload || "Address Not Created");
                } else {
                    toast.success(result.payload.message || "Address Created successfully!");
                }
       
           } catch (error) {
             toast.error("Failed to create Address: " + error.message);
           }
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Addresses</h2>
            <div className="p-6 rounded-2xl shadow-card bg-white">
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
                    {user.addresses.map((address, index) => (
                    <AddressCard
                        key={`address-${index}`}
                        id={address._id}
                        type={address.type}
                        address={address.address}
                        fullData={address} // pass full address for edit
                        onEdit={handleEdit} // pass edit handler
                    />
                    ))}

                    <button
                        onClick={handleAdd}
                        className="flex items-center justify-center py-3 border border-dashed border-gray-400 rounded-lg text-gray-600 hover:border-gray-600 hover:text-gray-800 transition-colors">
                        <FaPlus className="mr-2" />
                        Add New Address
                    </button>
                </div>
            </div>
            <AddAddressModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingAddress}
                mode={editingAddress ? 'edit' : 'add'}
            />
        </div>
    )
}

export default Addresses
