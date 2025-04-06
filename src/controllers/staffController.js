import Customer from '../models/Customer.js';
import Service from '../models/Service.js';
import Vendor from '../models/Vendor.js';
import User from '../models/User.js';

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

    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Error searching vendors' });
  }
};

// Add a customer
export const addCustomer = async (req, res) => {
  try {
    const { name, mobile, gstNumber, dob, address } = req.body;
    const newCustomer = new Customer({ name, mobile, gstNumber, dob, address });
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ message: 'Error adding customer' });
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
    const { customerId, serviceType, status, scheduledDate, payment } =
      req.body;
    const userId = req.user.id;
    console.log(userId);
    const customer = await Customer.findById(customerId);
    if (!customer)
      return res.status(404).json({ message: 'Customer not found' });

    const newService = new Service({
      customerName: customer.name,
      customerMobile: customer.mobile,
      serviceType,
      status,
      scheduledDate,
      payment,
      userId,
      customerId,
    });
    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ message: 'Error adding service' });
    console.log(error);
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
    const { name, mobile, category, address, alternateMobile } = req.body;
    const newVendor = new Vendor({
      name,
      mobile,
      category,
      address,
      alternateMobile,
    });
    await newVendor.save();
    res.status(201).json(newVendor);
  } catch (error) {
    res.status(400).json({ message: 'Error adding vendor' });
  }
};
