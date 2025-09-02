import Customer from '../models/Customer.js';
import Service from '../models/Service.js';
import Vendor from '../models/Vendor.js';
import User from '../models/User.js';
import Verification from '../models/Verification.js';

import sendMail from '../services/emailService.js';
import CustomerB2B from '../models/CustomerB2B.js';
import B2B_Service from '../models/B2B_Service.js';

// Get all customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const searchCustomers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Find customers whose name or mobile number matches the query
    const customers = await Customer.find({
      $or: [
        { name: { $regex: query, $options: 'i' } }, // Case-insensitive name search
        { mobile: { $regex: query, $options: 'i' } }, // Case-insensitive mobile search
      ],
    });

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error searching customers' });
  }
};

export const searchB2bCustomer = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Find customers whose name or mobile number matches the query
    const customers = await CustomerB2B.find({
      $or: [
        { businessName: { $regex: query, $options: 'i' } }, // Case-insensitive name search
        { businessContact: { $regex: query, $options: 'i' } }, // Case-insensitive mobile search
      ],
    });

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error searching B2B customers' });
  }
};

export const searchVendors = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({
        message: 'Vendor name/mobile required to search',
      });
    }

    const vendors = await Vendor.find({
      $or: [
        {
          name: { $regex: query, $options: 'i' },
        },
        {
          mobile: { $regex: query, $options: 'i' },
        },
      ],
    });

    const response = vendors.map((vendor) => ({
      name: vendor.name,
      mobile: vendor.mobile,
    }));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error searching vendors' });
  }
};

// Add a customer
export const addCustomer = async (req, res) => {
  try {
    const { name, mobile, gstNumber, dob, address } = req.body;
    // check if the custoemr with the mobile number already exists
    const existingCustomer = await Customer.findOne({ mobile });
    if (existingCustomer) {
      console.log('customer exits');
      return res.status(400).json({
        message: 'Customer with this mobile number already exists',
      });
    }

    const newCustomer = new Customer({ name, mobile, gstNumber, dob, address });

    await newCustomer.save();

    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ message: 'Error adding customer' });
  }
};

export const editCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({
      message: 'Customer updated successfully',
      customer: updatedCustomer,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating customer' });
  }
};

// Get all services (filtered by status if needed)
export const getServices = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const services = await Service.find(filter).populate(
      'userId',
      'name phone',
    );
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a service
export const addService = async (req, res) => {
  try {
    const {
      customerId,
      serviceType,
      status,
      scheduledDate,
      payment,
      vendorId,
    } = req.body;
    const userId = req.user.id;

    const customer = await Customer.findById(customerId);
    if (!customer)
      return res.status(404).json({ message: 'Customer not found' });

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    const newService = new Service({
      customerName: customer.name,
      customerMobile: customer.mobile,
      serviceType,
      status,
      scheduledDate,
      payment,
      userId,
      customerId,
      vendorId,
      vendorName: vendor.name,
      vendorMobile: vendor.mobile,
    });
    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ message: 'Error adding service' });
    console.log(error);
  }
};

// edit a service
export const editService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedService = await Service.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(updatedService);
  } catch (error) {
    res.status(400).json({ message: 'Error updating service' });
  }
};

// Get all vendors
export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a vendor

export const addVendor = async (req, res) => {
  try {
    const { name, mobile, category, address, alternateMobile, kyc_status } =
      req.body;

    const files = req.files;
    let qrCodeImageBase64 = null;
    let aadharImageBase64 = null;
    let bankDetailsBase64 = null;

    const processFile = (fileArray, fieldName) => {
      if (fileArray && fileArray[0]) {
        const file = fileArray[0];
        console.log(
          `Uploaded ${fieldName} File:`,
          file.originalname,
          file.mimetype,
          file.size,
        );

        if (file.size > 1024 * 1024 * 1) {
          // 1MB

          throw new Error(`${fieldName} file too large (max 1MB).`);
        }
        return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      }
      return null;
    };

    if (files) {
      if (files.qrCodeImageFile) {
        qrCodeImageBase64 = processFile(files.qrCodeImageFile, 'QR Code Image');
      }
      if (files.aadharImageFile) {
        aadharImageBase64 = processFile(files.aadharImageFile, 'Aadhar Image');
      }
      if (files.bankDetailsFile) {
        bankDetailsBase64 = processFile(
          files.bankDetailsFile,
          'Bank Details Image',
        );
      }
    }

    const newVendor = new Vendor({
      name,
      mobile,
      category,
      address,
      alternateMobile,
      kyc_status,
      qrCodeImage: qrCodeImageBase64,
      aadharImage: aadharImageBase64,
      bankDetails: bankDetailsBase64,
    });

    await newVendor.save();
    res.status(201).json(newVendor);
  } catch (error) {
    console.error('Error adding vendor:', error);

    res.status(400).json({
      message: error.message || 'Error adding vendor',
      error: error.toString(),
    });
  }
};

// export const editVendor = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     const updatedVendor = await Vendor.findByIdAndUpdate(id, updateData, {
//       new: true,
//     });
//     if (!updatedVendor) {
//       return res.status(404).json({ message: 'Vendor not found' });
//     }
//     res.status(200).json({
//       message: 'Vendor updated successfully',
//       vendor: updatedVendor,
//     });
//   } catch (error) {
//     res.status(400).json({ message: 'Error updating vendor' });
//   }
// };

// staffController.js

export const editVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const files = req.files;

    // helper function to convert file buffer to base64
    const fileToBase64 = (file) => {
      return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    };

    if (files) {
      if (files.qrCodeImageFile && files.qrCodeImageFile[0]) {
        updateData.qrCodeImage = fileToBase64(files.qrCodeImageFile[0]);
      }
      if (files.aadharImageFile && files.aadharImageFile[0]) {
        updateData.aadharImage = fileToBase64(files.aadharImageFile[0]);
      }
      if (files.bankDetailsFile && files.bankDetailsFile[0]) {
        updateData.bankDetailsFile = fileToBase64(files.bankDetailsFile[0]);
      }
    }
    const updatedVendor = await Vendor.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.status(200).json({
      message: 'Vendor updated successfully',
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error('Error updating vendor:', error.message);
    res.status(400).json({
      message: 'Error updating vendor',
      error: error.message,
    });
  }
};

export const requestVendorDeletion = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // save otp in database
    await Verification.create({
      vendorId: id,
      otp,
      expiresAt,
    });

    // send otp via mail
    await sendMail({
      to: 'mendt.otp@rprb2b.com',
      // to: 'kishan.repaireze@gmail.com',
      subject: 'OTP for Vendor Deletion',
      text: `Your OTP for deleting vendor ${vendor.name} is: ${otp}. This will expire in 10 minutes.`,
    });

    res.status(200).json({ message: 'Otp sent to email successfully' });
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error requesting vendor deletion', error: error });
  }
};

export const verifyVendorDeletion = async (req, res) => {
  try {
    const { vendorId, otp } = req.body;
    const verification = await Verification.findOne({ vendorId, otp });

    if (!verification) {
      return res.status(404).json({ message: 'Invalid OTP' });
    }

    if (verification.expiresAt < new Date()) {
      await Verification.deleteOne({ _id: verification._id });
      return res.status(400).json({ message: 'OTP expired' });
    }

    // delete vendor
    const deletedVendor = await Vendor.findByIdAndDelete(vendorId);
    if (!deletedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // delete verification record
    await Verification.deleteOne({ _id: verification._id });

    res.status(200).json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error verifying vendor deletion' });
  }
};

export const requestCustomerDeletion = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // save otp in database
    await Verification.create({
      customerId: id,
      otp,
      expiresAt,
    });

    // send otp via mail
    await sendMail({
      to: 'mendt.otp@rprb2b.com',
      subject: 'OTP for Customer Deletion',
      text: `Your OTP for deleting customer ${customer.name} is: ${otp}. This will expire in 10 minutes.`,
    });

    res.status(200).json({ message: 'Otp sent to email successfully' });
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error requesting customer deletion', error: error });
  }
};

export const verifyCustomerDeletion = async (req, res) => {
  try {
    const { customerId, otp } = req.body;
    const verification = await Verification.findOne({ customerId, otp });

    if (!verification) {
      return res.status(404).json({ message: 'Invalid OTP' });
    }

    if (verification.expiresAt < new Date()) {
      await Verification.deleteOne({ _id: verification._id });
      return res.status(400).json({ message: 'OTP expired' });
    }

    // delete customer
    const deletedCustomer = await Customer.findByIdAndDelete(customerId);
    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // delete verification record
    await Verification.deleteOne({ _id: verification._id });

    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error verifying customer deletion' });
  }
};

export const requestServiceDeletion = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // save otp in database
    await Verification.create({
      serviceId: id,
      otp,
      expiresAt,
    });

    // send otp via mail
    await sendMail({
      to: 'mendt.otp@rprb2b.com',
      subject: 'OTP for Service Deletion',
      text: `Your OTP for deleting ${service.serviceType} service for ${service.customerName} is: ${otp}. This will expire in 10 minutes.`,
    });

    res.status(200).json({ message: 'Otp sent to email successfully' });
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error requesting service deletion', error: error });
  }
};

export const verifyServiceDeletion = async (req, res) => {
  try {
    const { serviceId, otp } = req.body;
    const verification = await Verification.findOne({ serviceId, otp });

    if (!verification) {
      return res.status(404).json({ message: 'Invalid OTP' });
    }

    if (verification.expiresAt < new Date()) {
      await Verification.deleteOne({ _id: verification._id });
      return res.status(400).json({ message: 'OTP expired' });
    }

    // delete vendor
    const deletedService = await Service.findByIdAndDelete(serviceId);
    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // delete verification record
    await Verification.deleteOne({ _id: verification._id });

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error verifying service deletion' });
  }
};
// test

// b2b customer
export const addB2BCustomer = async (req, res) => {
  try {
    const {
      businessName,
      businessContact,
      representativeName,
      representativeContact,
      address,
      siteVisitDone,
      reasonForNo,
      servicesRequired = [],
    } = req.body;

    if (
      !businessName?.trim() ||
      !businessContact?.trim() ||
      !representativeName?.trim() ||
      !representativeContact?.trim() ||
      !address?.trim() ||
      siteVisitDone === undefined
    ) {
      return res.status(400).json({
        message: 'All fields are required!',
      });
    }

    // check existing cutomer
    const existingCustomer = await CustomerB2B.findOne({
      businessName,
      businessContact,
    });

    if (existingCustomer) {
      return res.status(409).json({
        message:
          'Customer with this business name and contact number already exists!',
      });
    }

    // create new customer
    const newB2BCustomer = new CustomerB2B({
      businessName,
      businessContact,
      representativeName,
      representativeContact,
      address,
      siteVisitDone,
    });

    if (!siteVisitDone) {
      if (!reasonForNo?.trim()) {
        return res.status(400).json({
          message: 'You must specify a reason for not visiting site !',
        });
      }
      newB2BCustomer.reasonForNo = reasonForNo;
    } else {
      if (!Array.isArray(servicesRequired) || servicesRequired.length === 0) {
        return res.status(400).json({
          message:
            'Please specify at least one service the business requires !',
        });
      }
      newB2BCustomer.servicesRequired = servicesRequired;
    }

    await newB2BCustomer.save();

    res.status(201).json({
      message: 'New B2B customer created successfully',
      customer: newB2BCustomer,
    });
  } catch (error) {
    console.error('Error adding b2b customer', error);
    res.status(500).json({
      message: 'Error adding new B2B customer',
      error,
    });
  }
};

export const getB2BCustomers = async (req, res) => {
  try {
    const customers = await CustomerB2B.find().sort({ dateOfAddition: -1 });

    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const editB2BCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedCustomer = await CustomerB2B.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      },
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({
      message: 'Customer updated successfully',
      customer: updatedCustomer,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating customer' });
  }
};

export const requestB2BCustomerDeletion = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await CustomerB2B.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
    // save otp in database
    await Verification.create({
      customerId: id,
      otp,
      expiresAt,
    });
    // send otp via mail
    await sendMail({
      to: 'mendt.otp@rprb2b.com',
      subject: 'OTP for B2B Customer Deletion',
      text: `Your OTP for deleting b2b customer ${customer.businessName} is: ${otp}. This will expire in 10 minutes.`,
    });

    res.status(200).json({ message: 'Otp sent to email successfully' });
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error requesting customer deletion', error: error });
  }
};

export const verifyB2BCustomerDeletion = async (req, res) => {
  try {
    const { customerId, otp } = req.body;
    const verification = await Verification.findOne({ customerId, otp });

    if (!verification) {
      return res.status(404).json({ message: 'Invalid OTP' });
    }
    if (verification.expiresAt < new Date()) {
      await Verification.deleteOne({ _id: verification._id });
      return res.status(400).json({ message: 'OTP expired' });
    }

    // delete customer
    const deletedCustomer = await CustomerB2B.findByIdAndDelete(customerId);
    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    // delete verification record
    await Verification.deleteOne({ _id: verification._id });
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error verifying customer deletion', error: error });
  }
};

// b2b service
export const getB2BServices = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = status ? { serviceStatus: status } : {};

    const services = await B2B_Service.find(filter).populate(
      'customerId',
      'businessName businessContact',
    );

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addB2BService = async (req, res) => {
  try {
    const { customerId, services, serviceStatus, payment, date } = req.body;

    if (!customerId || !Array.isArray(services) || !serviceStatus || !payment) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (payment.isPaid && (!payment.amount || payment.amount <= 0)) {
      return res
        .status(400)
        .json({ message: 'Amount is required when payment is done!' });
    }

    const customer = await CustomerB2B.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const newB2bService = new B2B_Service({
      customerId,
      businessName: customer.businessName,
      businessContact: customer.businessContact,
      representativeName: customer.representativeName,
      representativeContact: customer.representativeContact,
      services,
      serviceStatus,
      payment,
      date: serviceStatus === 'ongoing' ? new Date() : date || null,
    });

    await newB2bService.save();
    return res.status(201).json({
      message: 'New B2B service created!',
      service: newB2bService,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error adding new B2B Service!',
      error,
    });
  }
};
export const requestB2BServiceDeletion = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await B2B_Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
    // save otp in database
    await Verification.create({
      serviceId: id,
      otp,
      expiresAt,
    });
    // send otp via mail
    await sendMail({
      to: 'mendt.otp@rprb2b.com',
      subject: 'OTP for B2B Service Deletion',
      text: `Your OTP for deleting b2b services ${service.services.map((service) => `${service} `)} for ${service.businessName} is: ${otp}. This will expire in 10 minutes.`,
    });
    res.status(200).json({ message: 'Otp sent to email successfully' });
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error requesting service deletion', error: error });
  }
};
export const verifyB2BServiceDeletion = async (req, res) => {
  try {
    const { serviceId, otp } = req.body;
    const verification = await Verification.findOne({ serviceId, otp });
    if (!verification) {
      return res.status(404).json({ message: 'Invalid OTP' });
    }
    if (verification.expiresAt < new Date()) {
      await Verification.deleteOne({ _id: verification._id });
      return res.status(400).json({ message: 'OTP expired' });
    }
    // delete vendor
    const deletedService = await B2B_Service.findByIdAndDelete(serviceId);
    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    // delete verification record
    await Verification.deleteOne({ _id: verification._id });
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error verifying service deletion', error: error });
  }
};
// edit b2b service
export const editB2BService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedService = await B2B_Service.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json({
      message: 'Service updated successfully',
      service: updatedService,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating service' });
  }
};
