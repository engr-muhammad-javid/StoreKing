import React from 'react'
import Row from './Row';

export default function List({categories}) {
  return (
    <table className="min-w-full table-auto text-sm border border-gray-200">
        <thead className="bg-gray-100 text-gray-700">
            <tr>
            <th className="px-4 py-3 text-left font-medium">Name</th>
            <th className="px-4 py-3 text-left font-medium">Parent Category</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
        </thead>
        <tbody>
            {categories.length === 0 ? (
            <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                    No categories found.
                </td>
                </tr>
            ) : ( 
                categories.map((category) => (

                    <Row
                        key={category._id}
                        id={category._id}
                        name={category.name}
                        parent={category.parent}
                        isActive={category.isActive}
                        fullData={category}
                        onEdit={handleEdit}
                    />
                    ))
                )}

        </tbody>
    </table>
  )
}
