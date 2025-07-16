import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { closeModal } from '../../../store/slices/modalSlice';
import { createRole, updateRole } from '../../../store/slices/roleSlice';
import {
  initializeForm,
  updateFormField,
  setFormErrors,
  setSubmitting,
  resetForm,
} from '../../../store/slices/formSlice';
import { TextInput } from '../../common';
import { IoClose } from 'react-icons/io5';
import { FaSave } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const RoleForm = ({ initialData = {}, mode = 'add' }) => {
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.form.forms.role || {});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [globalCheckAll, setGlobalCheckAll] = useState(false);

  const defaultActions = ['create', 'update', 'delete', 'view'];

  const permissionsList = [
    { name: 'Dashboard', path: 'dashboard', actions: ['view'] },

    { type: 'section', name: 'Product & Stock' },
    { name: 'Products', path: 'products' },
    { name: 'Purchase', path: 'purchase' },
    { name: 'Damages', path: 'damages' },
    { name: 'Stock', path: 'stock', actions: ['view'] },

    { type: 'section', name: 'POS & Orders' },
    { name: 'POS', path: 'pos', actions: ['create', 'view'] },
    { name: 'POS Orders', path: 'pos-orders', actions: ['view'] },
    { name: 'Online Orders', path: 'online-orders', actions: ['view'] },
    { name: 'Return Orders', path: 'return-orders', actions: ['create', 'view'] },

    { type: 'section', name: 'Promo' },
    { name: 'Coupons', path: 'coupons' },
    { name: 'Promotions', path: 'promotions' },
    { name: 'Product Sections', path: 'product-sections' },

    { type: 'section', name: 'Communications' },
    { name: 'Push Notifications', path: 'push-notifications', actions: ['create', 'view'] },
    { name: 'Subscribers', path: 'subscribers', actions: ['view'] },

    { type: 'section', name: 'Users' },
    { name: 'Administrators', path: 'administrators' },
    { name: 'Delivery Boys', path: 'delivery-boys' },
    { name: 'Customers', path: 'customers' },
    { name: 'Employees', path: 'employees' },

    { type: 'section', name: 'Accounts' },
    { name: 'Transactions', path: 'transactions', actions: ['view'] },

    { type: 'section', name: 'Reports' },
    { name: 'Sales Report', path: 'sales-report', actions: ['view'] },
    { name: 'Products Report', path: 'products-report', actions: ['view'] },
    { name: 'Credit Balance Report', path: 'credit-balance-report', actions: ['view'] },

    { type: 'section', name: 'Settings' },
    { name: 'Settings', path: 'settings', actions: ['view'] },
    { name: 'Company', path: 'settings/company', actions: ['create', 'update'] },
    { name: 'Site', path: 'settings/site', actions: ['create', 'update'] },
    { name: 'Delivery Zones', path: 'settings/delivery-zones'},
    { name: 'Mail', path: 'settings/mail', actions: ['create', 'update'] },
    { name: 'OTP', path: 'settings/otp', actions: ['create', 'update'] },
    { name: 'Notification', path: 'settings/notification', actions: ['create', 'update'] },
    { name: 'Notification Alert', path: 'settings/notification-alert', actions: ['create', 'update'] },
    { name: 'Social Media', path: 'settings/social-media', actions: ['create', 'update'] },
    { name: 'Cookies', path: 'settings/cookies', actions: ['create', 'update'] },
    { name: 'Analytics', path: 'settings/analytics', actions: ['create', 'update'] },
    { name: 'Theme', path: 'settings/theme', actions: ['create', 'update'] },
    { name: 'Sliders', path: 'settings/sliders' },
    { name: 'Currencies', path: 'settings/currencies' },
    { name: 'Product Categories', path: 'settings/categories' },
    { name: 'Product Attributes', path: 'settings/attributes'},
    { name: 'Product Brands', path: 'settings/brands'},
    { name: 'Suppliers', path: 'settings/suppliers'},
    { name: 'Outlets', path: 'settings/outlets'},
    { name: 'Benefits', path: 'settings/benefits'},
    { name: 'Units', path: 'settings/units'},
    { name: 'Taxes', path: 'settings/taxes'},
    { name: 'Pages', path: 'settings/pages'},
    { name: 'Role & Permissions', path: 'settings/roles'},
    { name: 'Languages', path: 'settings/languages'},
    { name: 'Sms Gateway', path: 'settings/sms-gateway', actions: ['create', 'update'] },
    { name: 'Payment Gateway', path: 'settings/payment-gateway', actions: ['create', 'update'] },
    { name: 'License', path: 'settings/license', actions: ['view'] },
  ];

  useEffect(() => {
    const convertPermissionsToState = () => {
      const initialPermissions = {};
      if (initialData.permissions?.length) {
        initialData.permissions.forEach((perm) => {
          const { page, ...actions } = perm;
          initialPermissions[page] = actions;
        });
      }
      return initialPermissions;
    };

    dispatch(
      initializeForm({
        entity: 'role',
        initialData: {
          name: initialData.name || '',
          permissions: convertPermissionsToState(),
        },
        mode,
      })
    );
  }, [dispatch, initialData, mode]);

  const validateForm = () => {
    const errors = {};
    if (!formState.formData?.name) {
      errors.name = 'Name is required';
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormField({ entity: 'role', name, value }));
  };

  const handlePermissionToggle = (page, action) => {
    const currentPermissions = formState.formData?.permissions || {};
    const pagePermissions = { ...(currentPermissions[page] || {}) };

    pagePermissions[action] = !pagePermissions[action];

    dispatch(
      updateFormField({
        entity: 'role',
        name: 'permissions',
        value: { ...currentPermissions, [page]: pagePermissions },
      })
    );
  };

  const handleRowCheckAll = (page) => {
    const currentPermissions = formState.formData?.permissions || {};
    const item = permissionsList.find((i) => i.path === page);
    const allowedActions = item?.actions || defaultActions;

    const allChecked = allowedActions.every((action) => currentPermissions[page]?.[action]);

    const newPagePermissions = {};
    allowedActions.forEach((action) => {
      newPagePermissions[action] = !allChecked;
    });

    dispatch(
      updateFormField({
        entity: 'role',
        name: 'permissions',
        value: {
          ...currentPermissions,
          [page]: newPagePermissions,
        },
      })
    );
  };

  const handleGlobalCheckAll = () => {
    const shouldCheckAll = !globalCheckAll;
    const newPermissions = {};

    permissionsList.forEach((item) => {
      if (item.path) {
        const allowedActions = item.actions || defaultActions;
        newPermissions[item.path] = {};
        allowedActions.forEach((action) => {
          newPermissions[item.path][action] = shouldCheckAll;
        });
      }
    });

    setGlobalCheckAll(shouldCheckAll);

    dispatch(
      updateFormField({
        entity: 'role',
        name: 'permissions',
        value: newPermissions,
      })
    );
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (formState.isSubmitting || hasSubmitted) return;

      setHasSubmitted(true);

      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        dispatch(setFormErrors({ entity: 'role', errors: validationErrors }));
        Object.entries(validationErrors).forEach(([key, err]) =>
          toast.error(err, { toastId: `validation-error-${key}-${mode}` })
        );
        setHasSubmitted(false);
        return;
      }

      const permissions = formState.formData?.permissions || {};
      const permissionsArray = Object.keys(permissions).map((page) => ({
        page,
        ...permissions[page],
      }));

      const payload = {
        name: formState.formData?.name,
        permissions: permissionsArray,
      };

      dispatch(setSubmitting({ entity: 'role', isSubmitting: true }));
      try {
        const action =
          mode === 'edit'
            ? updateRole({ data: payload, id: initialData._id })
            : createRole(payload);
        const result = await dispatch(action);
        if (result.meta.requestStatus === 'rejected') {
          throw new Error(result.payload || 'Submission failed');
        }
        toast.success(`Role ${mode === 'edit' ? 'updated' : 'created'} successfully`, {
          toastId: `success-${mode}`,
        });
        dispatch(closeModal());
        dispatch(resetForm({ entity: 'role' }));
      } catch (error) {
        toast.error('Error Occurred: ' + error.message);
      } finally {
        dispatch(setSubmitting({ entity: 'role', isSubmitting: false }));
        setHasSubmitted(false);
      }
    },
    [dispatch, formState, mode, initialData, hasSubmitted]
  );

  const handleClose = useCallback(() => {
    dispatch(closeModal());
    dispatch(resetForm({ entity: 'role' }));
  }, [dispatch]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TextInput
        label="Role Name *"
        name="name"
        value={formState.formData?.name || ''}
        onChange={handleChange}
        required
        error={formState.errors?.name}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border mt-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border text-left">Page</th>
              {defaultActions.map((action) => (
                <th key={action} className="p-2 border capitalize">{action}</th>
              ))}
              <th className="p-2 border">
                <input
                  type="checkbox"
                  checked={globalCheckAll}
                  onChange={handleGlobalCheckAll}
                  title="Check all permissions"
                /> All
              </th>
            </tr>
          </thead>
          <tbody>
            {permissionsList.map((item) => {
              if (item.type === 'section') {
                return (
                  <tr key={item.name} className="bg-gray-50">
                    <td className="p-2 border font-semibold text-sm uppercase text-gray-500" colSpan={6}>
                      {item.name}
                    </td>
                  </tr>
                );
              }

              const { name, path } = item;
              const allowedActions = item.actions || defaultActions;
              const pagePermissions = formState.formData?.permissions?.[path] || {};
              const allChecked = allowedActions.every((a) => pagePermissions[a]);
              const isSubMenu = path.startsWith('settings/') && path !== 'settings';

              return (
                <tr key={path}>
                  <td className={`p-2 border font-medium ${isSubMenu ? 'pl-8 text-gray-700' : ''}`}>
                    {isSubMenu ? '↳ ' : ''}{name}
                  </td>
                  {defaultActions.map((action) => (
                    <td key={`${path}-${action}`} className="p-2 border text-center">
                      {allowedActions.includes(action) ? (
                        <input
                          type="checkbox"
                          checked={!!pagePermissions[action]}
                          onChange={() => handlePermissionToggle(path, action)}
                        />
                      ) : (
                        '-'
                      )}
                    </td>
                  ))}
                  <td className="p-2 border text-center">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={() => handleRowCheckAll(path)}
                      title="Select all for this row"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
          disabled={formState.isSubmitting}
        >
          <IoClose className="inline mr-1" />
          Close
        </button>
        <button
          type="submit"
          className={`px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 ${
            formState.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          } flex items-center`}
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? (
            <ClipLoader color="#fff" size={16} className="mr-1" />
          ) : (
            <FaSave className="inline mr-1" />
          )}
          {formState.isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default RoleForm;
