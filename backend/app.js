import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './routes/auth.routes.js';
import productsRouter from './routes/product.routes.js';
import categoryRouter from "./routes/category.routes.js";
import brandRouter from "./routes/brand.routes.js";
import roleRouter from "./routes/role.routes.js";
import currencyRouter from "./routes/currency.routes.js";
import companySettingRouter from "./routes/companySetting.routes.js";
import siteSettingRoutes from "./routes/siteSetting.routes.js";
import deliveryZoneRoutes from "./routes/deliveryZone.routes.js";
import mailSettingRouter from "./routes/mailSetting.routes.js";
import otpSettingRouter from "./routes/otpSetting.routes.js";
import notificationSettingRouter from "./routes/notificationSetting.routes.js";
import supplierRouter from "./routes/supplier.routes.js";
import outletRouter from "./routes/outlet.routes.js";
import benefitRouter from "./routes/benefit.routes.js";
import unitRouter from "./routes/unit.routes.js";
import taxRouter from "./routes/tax.routes.js";
import pageRouter from "./routes/page.routes.js";
import languageRoutes from "./routes/language.routes.js";


export const app = express();

// Required to get __dirname with ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('public'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/api/v1', authRouter);
app.use('/api/v1/products', productsRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/currencies", currencyRouter);
app.use("/api/v1/roles", roleRouter);
app.use("/api/v1/company-setting", companySettingRouter);
app.use("/api/v1/site-setting", siteSettingRoutes);
app.use("/api/v1/mail-setting", mailSettingRouter);
app.use("/api/v1/delivery-zones", deliveryZoneRoutes);
app.use("/api/v1/otp-setting", otpSettingRouter);
app.use("/api/v1/notification-setting", notificationSettingRouter);
app.use("/api/v1/suppliers", supplierRouter);
app.use("/api/v1/outlets", outletRouter);
app.use("/api/v1/benefits", benefitRouter);
app.use("/api/v1/units", unitRouter);
app.use("/api/v1/taxes", taxRouter);
app.use("/api/v1/pages", pageRouter);
app.use("/api/v1/languages", languageRoutes);

