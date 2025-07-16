import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateNotificationAlertMessage,
  toggleNotificationAlertMessage,
} from '../../../store/slices/notificationAlertSlice';

import { Textarea, SwitchToggle } from '../../../components/common';
import { hasPermission } from '../../../utils/permissions';

const tabs = ['mail', 'sms', 'push_notification'];

const messageLabels = {
  1: 'Order Pending Message',
  2: 'Order Confirmation Message',
  3: 'Order On The Way Message',
  4: 'Order Delivered Message',
  5: 'Order Canceled Message',
  6: 'Order Rejected Message',
  7: 'Admin And Manager New Order Message',
  8: 'Delivery Boy After Assign Message',
};

const defaultTexts = {
  1: 'Your order is successfully placed.',
  2: 'Your order is confirmed.',
  3: 'Your order is on the way.',
  4: 'Your order is successfully delivered.',
  5: 'Your order is canceled.',
  6: 'Your order is rejected.',
  7: 'You have a new order.',
  8: 'You have been assigned an order for delivery.',
};

const NotificationAlertSettings = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.notificationAlert);
  const { permissions } = useSelector((state) => state.auth);

  const canView = hasPermission(permissions, 'settings/notifications', 'view');
  const canUpdate = hasPermission(permissions, 'settings/notifications', 'update');

  const [activeTab, setActiveTab] = useState('mail');

  const handleToggle = (type, key) => {
    if (!canUpdate) return;
    dispatch(toggleNotificationAlertMessage({ type, key }));
  };

  const handleChange = (type, key, value) => {
    if (!canUpdate) return;
    dispatch(updateNotificationAlertMessage({ type, key, message: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canUpdate) return;
    console.log('Saving:', data[activeTab]);
    // TODO: Replace with actual save API call
  };

  if (!canView) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-red-600 font-semibold">
        You do not have permission to view this page.
      </div>
    );
  }

  return (
    <div>
      {/* Tabs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`db-tab-sub-btn w-full flex items-center gap-3 h-10 px-4 rounded-lg transition ${
              activeTab === tab
                ? 'bg-green-600 text-white'
                : 'bg-white hover:bg-green-100'
            }`}
          >
            <span className="capitalize">{tab.replace('_', ' ')}</span>
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="db-card">
        <div className="db-card-header">
          <h3 className="db-card-title capitalize">
            {activeTab.replace('_', ' ')} Notification Messages
          </h3>
        </div>
        <div className="db-card-body">
          <form className="grid grid-cols-1 xl:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            {Object.entries(messageLabels).map(([key, label]) => {
              const enabled = data[activeTab]?.[key]?.enabled || false;
              const message = data[activeTab]?.[key]?.message || '';

              return (
                <div key={key} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-heading">{label}</label>
                    <SwitchToggle
                      name={`${activeTab}-${key}`}
                      checked={enabled}
                      onChange={() => handleToggle(activeTab, key)}
                      yesLabel="ON"
                      noLabel="OFF"
                      color="green"
                      disabled={!canUpdate}
                    />
                  </div>
                  <Textarea
                    name={`${activeTab}-${key}-text`}
                    value={message}
                    onChange={(e) => handleChange(activeTab, key, e.target.value)}
                    placeholder={defaultTexts[key]}
                    height="h-14"
                    disabled={!canUpdate}
                  />
                </div>
              );
            })}

            {canUpdate && (
              <div className="col-span-full">
                <button
                  type="submit"
                  className="db-btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  <i className="lab lab-fill-save text-base mr-1"></i> Save
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default NotificationAlertSettings;
