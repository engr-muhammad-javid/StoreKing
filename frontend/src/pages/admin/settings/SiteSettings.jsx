import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  fetchSite,
  createSite,
  updateSite,
} from '../../../store/slices/siteSlice';

const SiteSettings = () => {
  const dispatch = useDispatch();
  const { site, loading } = useSelector((state) => state.site);
  const [settings, setSettings] = useState({
    dateFormat: 'd-m-Y',
    timeFormat: '12 Hour',
    defaultTimezone: 'Asia/Dhaka',
    defaultLanguage: 'English',
    defaultSmsGateway: '',
    copyright: '',
    androidAppLink: '',
    iosAppLink: '',
    nonPurchaseProductMaxQty: '',
    digitAfterDecimal: '',
    defaultCurrency: 'Dollars ($)',
    currencyPosition: 'left',
    cashOnDelivery: true,
    isReturnPriceToCredit: false,
    onlinePaymentGateway: true,
    languageSwitch: true,
    pickUp: false,
    emailVerification: false,
    phoneVerification: false,
    appDebug: false,
    googleMapKey: '',
  });

  useEffect(() => {
    dispatch(fetchSite());
  }, [dispatch]);

  useEffect(() => {
    if (site) {
      setSettings((prev) => ({
        ...prev,
        ...site,
      }));
    }
  }, [site]);

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setSettings((prev) => ({
        ...prev,
        [name]:
          type === 'checkbox'
            ? checked
            : type === 'radio'
            ? name === 'currencyPosition'
              ? value
              : value === 'true' || value === true
            : value,
      }));
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(settings).forEach(([key, value]) => {
      if (value !== null && typeof value !== 'object') {
        formData.append(key, value);
      }
    });

    try {
      if (!site) {
        await dispatch(createSite(formData)).unwrap();
        toast.success('Settings created successfully!');
      } else {
        await dispatch(updateSite({ data: formData, id: site._id })).unwrap();
        toast.success('Settings updated successfully!');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to save settings');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Site Settings</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 form-row">
          <div className="form-col-12 sm:form-col-6">
            <label htmlFor="dateFormat" className="block text-sm font-medium mb-1 db-field-title required">Date Format <span className="text-red-500">*</span></label>
            <select
              id="dateFormat"
              name="dateFormat"
              value={settings.dateFormat}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 db-field-control"
              required
            >
              {[
                'd-m-Y (03-06-2025)',
                'm-d-Y (06-03-2025)',
                'Y-m-d (2025-06-03)',
                'd.m.Y (03.06.2025)',
                'm.d.Y (06.03.2025)',
                'Y.m.d (2025.06.03)',
                'd/m/Y (03/06/2025)',
                'm/d/Y (06/03/2025)',
                'Y/m/d (2025/06/03)',
                'd-M-Y (03-Jun-2025)',
                'd/M/Y (03/Jun/2025)',
                'd.M.Y (03.Jun.2025)',
                'd M Y (03 Jun 2025)',
                'd F, Y (03 June, 2025)',
                'd D M Y (03 Tue Jun 2025)',
                'D d M Y (Tue 03 Jun 2025)',
                'dS M Y (1st Jun 2025)',
              ].map((option) => (
                <option key={option} value={option.split(' ')[0]}>{option}</option>
              ))}
            </select>
          </div>

          <div className="form-col-12 sm:form-col-6">
            <label htmlFor="timeFormat" className="block text-sm font-medium mb-1 db-field-title required">Time Format <span className="text-red-500">*</span></label>
            <select
              id="timeFormat"
              name="timeFormat"
              value={settings.timeFormat}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 db-field-control"
              required
            >
              {[
                '12 Hour (12:50 PM)',
                '12 Hour (12:50 pm)',
                '24 Hour (12:50)',
              ].map((option) => (
                <option key={option} value={option.split(' ')[0]}>{option}</option>
              ))}
            </select>
          </div>

          <div className="form-col-12 sm:form-col-6">
            <label htmlFor="defaultTimezone" className="block text-sm font-medium mb-1 db-field-title required">Default Timezone <span className="text-red-500">*</span></label>
            <select
              id="defaultTimezone"
              name="defaultTimezone"
              value={settings.defaultTimezone}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 db-field-control"
              required
            >
              {[
                'Africa/Abidjan', 'Africa/Accra', 'Africa/Addis_Ababa', 'Africa/Algiers', 'Africa/Asmara',
                'Africa/Bamako', 'Africa/Bangui', 'Africa/Banjul', 'Africa/Bissau', 'Africa/Blantyre',
                
              ].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="form-col-12 sm:form-col-6">
            <label htmlFor="defaultLanguage" className="block text-sm font-medium mb-1 db-field-title required">Default Language <span className="text-red-500">*</span></label>
            <select
              id="defaultLanguage"
              name="defaultLanguage"
              value={settings.defaultLanguage}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 db-field-control"
              required
            >
              {['English', 'Bangla', 'Arabic'].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="form-col-12 sm:form-col-6">
            <label htmlFor="defaultSmsGateway" className="block text-sm font-medium mb-1 db-field-title">Default SMS Gateway</label>
            <select
              id="defaultSmsGateway"
              name="defaultSmsGateway"
              value={settings.defaultSmsGateway}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 db-field-control"
            >
              <option value="">--</option>
              {['Twilio', 'Clickatell', 'Nexmo', 'Msg91', '2Factor', 'Bulksms', 'Bulksmsbd', 'Telesign'].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="form-col-12 sm:form-col-6">
            <label htmlFor="copyright" className="block text-sm font-medium mb-1 db-field-title required">Copyright <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="copyright"
              name="copyright"
              value={settings.copyright || ''}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 db-field-control"
              required
            />
          </div>

          <div className="form-col-12 sm:form-col-6">
            <label htmlFor="androidAppLink" className="block text-sm font-medium mb-1 db-field-title">Android App Link</label>
            <input
              type="text"
              id="androidAppLink"
              name="androidAppLink"
              value={settings.androidAppLink || ''}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 db-field-control"
            />
          </div>

          <div className="form-col-12 sm:form-col-6">
            <label htmlFor="iosAppLink" className="block text-sm font-medium mb-1 db-field-title">iOS App Link</label>
            <input
              type="text"
              id="iosAppLink"
              name="iosAppLink"
              value={settings.iosAppLink || ''}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 db-field-control"
            />
          </div>

          <div className="form-col-12 sm:form-col-6">
            <label htmlFor="nonPurchaseProductMaxQty" className="block text-sm font-medium mb-1 db-field-title required">Non Purchase Product Maximum Quantity <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="nonPurchaseProductMaxQty"
              name="nonPurchaseProductMaxQty"
              value={settings.nonPurchaseProductMaxQty || ''}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 db-field-control"
              required
            />
          </div>

          <div className="form-col-12 sm:form-col-6">
            <label htmlFor="digitAfterDecimal" className="block text-sm font-medium mb-1 db-field-title required">Digit After Decimal Point <span className="text-blue-600">( Ex: 0.00 )</span> <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="digitAfterDecimal"
              name="digitAfterDecimal"
              value={settings.digitAfterDecimal || ''}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 db-field-control"
              required
            />
          </div>

          <div className="form-col-12 sm:form-col-6">
            <label htmlFor="defaultCurrency" className="block text-sm font-medium mb-1 db-field-title required">Default Currency <span className="text-red-500">*</span></label>
            <select
              id="defaultCurrency"
              name="defaultCurrency"
              value={settings.defaultCurrency}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 db-field-control"
              required
            >
              {['Dollars ($)', 'Rupee (₹)', 'Taka (৳)', 'Naira (₦)', 'Peso (₱)'].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="form-col-12 sm:form-col-6">
            <label htmlFor="googleMapKey" className="block text-sm font-medium mb-1 db-field-title required">Google Map Key <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="googleMapKey"
              name="googleMapKey"
              value={settings.googleMapKey || ''}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 db-field-control"
              required
            />
          </div>

          <div className="form-col-12 sm:form-col-6">
            <label className="block text-sm font-medium mb-1 db-field-title required">Currency Position <span className="text-red-500">*</span></label>
            <div className="db-field-radio-group flex space-x-4">
              <div className="db-field-radio">
                <input
                  type="radio"
                  id="currencyPosition_left"
                  name="currencyPosition"
                  value="left"
                  checked={settings.currencyPosition === 'left'}
                  onChange={handleChange}
                  className="custom-radio-field"
                />
                <label htmlFor="currencyPosition_left" className="ml-2 db-field-label">($) Left</label>
              </div>
              <div className="db-field-radio">
                <input
                  type="radio"
                  id="currencyPosition_right"
                  name="currencyPosition"
                  value="right"
                  checked={settings.currencyPosition === 'right'}
                  onChange={handleChange}
                  className="custom-radio-field"
                />
                <label htmlFor="currencyPosition_right" className="ml-2 db-field-label">Right ($)</label>
              </div>
            </div>
          </div>

          {[
            ['Cash On Delivery', 'cashOnDelivery', 'cash_on_delivery'],
            ['Is Return Product Price Add To Credit', 'isReturnPriceToCredit', 'is_return_price_to_credit'],
            ['Online Payment Gateway', 'onlinePaymentGateway', 'online_payment_gateway'],
            ['Language Switch', 'languageSwitch', 'language_switch'],
            ['Pick Up', 'pickUp', 'pick_up'],
            ['Email Verification', 'emailVerification', 'email_verification'],
            ['Phone Verification', 'phoneVerification', 'phone_verification'],
            ['App Debug', 'appDebug', 'debug'],
          ].map(([label, name, idPrefix]) => (
            <div key={name} className="form-col-12 sm:form-col-6">
              <label className="block text-sm font-medium mb-1 db-field-title required">{label} <span className="text-red-500">*</span></label>
              <div className="db-field-radio-group flex space-x-4">
                <div className="db-field-radio">
                  <input
                    type="radio"
                    id={`${idPrefix}_enable`}
                    name={name}
                    value={true}
                    checked={settings[name] === true}
                    onChange={handleChange}
                    className="custom-radio-field"
                  />
                  <label htmlFor={`${idPrefix}_enable`} className="ml-2 db-field-label">Enable</label>
                </div>
                <div className="db-field-radio">
                  <input
                    type="radio"
                    id={`${idPrefix}_disable`}
                    name={name}
                    value={false}
                    checked={settings[name] === false}
                    onChange={handleChange}
                    className="custom-radio-field"
                  />
                  <label htmlFor={`${idPrefix}_disable`} className="ml-2 db-field-label">Disable</label>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="form-col-12 text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 db-btn"
            disabled={loading}
          >
            <i className="lab lab-fill-save mr-2"></i>
            {loading ? 'Saving...' : !site ? 'Create Settings' : 'Update Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SiteSettings;