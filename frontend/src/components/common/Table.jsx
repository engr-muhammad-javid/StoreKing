import React from 'react';

const Table = ({ columns, data, renderRowActions, loading, emptyMessage = 'No data found.' }) => {
  const hasActions = typeof renderRowActions === 'function';

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading...</div>
      ) : (
        <table className="min-w-full table-auto text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left font-medium">
                  {col.header}
                </th>
              ))}
              {hasActions && <th className="px-4 py-3 text-left font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="text-center py-4 text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-4 py-3 flex gap-2 flex-wrap">
                      {renderRowActions(item)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Table;
