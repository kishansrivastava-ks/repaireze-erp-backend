import Customer from '../models/Customer.js';
import Vendor from '../models/Vendor.js';
import Payable from '../models/Payables.js';
import Receivables from '../models/Receivables.js';

export const addReceivable = async (req, res) => {
  try {
    const {
      customerId,
      serviceType,
      paymentType,
      amount,
      paymentStatus,
      invoiceNumber,
    } = req.body;
    console.log(customerId);
    console.log(serviceType);
    console.log(paymentType);
    console.log(paymentStatus);

    if (!customerId || !serviceType || !paymentType || !paymentStatus)
      return res.status(400).json({
        message: 'All fields are required',
      });

    if (paymentStatus === 'done' && (!amount || !invoiceNumber))
      return res.status(400).json({
        message:
          'Amount and Invoice Number are required when payment status is done',
      });

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(400).json({
        message: 'No customer found with that id',
      });
    }

    const newReceivable = new Receivables({
      customerName: customer.name,
      customerMobile: customer.mobile,
      serviceType,
      paymentType,
      amount,
      paymentStatus,
      invoiceNumber,
      customerId,
    });
    await newReceivable.save();
    res.status(201).json({
      message: 'Receivable added successfully',
      newReceivable,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding receivable',
      error,
    });
  }
};

export const addPayable = async (req, res) => {
  try {
    const {
      vendorId,
      serviceType,
      paymentAmount,
      paymentStatus,
      invoiceNumber,
    } = req.body;

    console.log(
      vendorId,
      serviceType,
      paymentAmount,
      paymentStatus,
      invoiceNumber,
    );

    if (!vendorId || !serviceType || !paymentAmount || !paymentStatus)
      return res.status(400).json({
        message: 'All fields are required',
      });

    if (paymentStatus === 'done' && (!paymentAmount || !invoiceNumber)) {
      return res.status(400).json({
        message:
          'Amount and Invoice Number are required when payment status is done',
      });
    }

    console.log('finding vendor');
    const vendor = await Vendor.findById(vendorId);
    if (!vendor)
      return res.status(404).json({
        message: 'Vendor not found',
      });

    console.log('vendor found', vendor);
    console.log('creating payable');

    const newPayable = new Payable({
      vendorId,
      vendorName: vendor.name,
      vendorMobile: vendor.mobile,
      serviceType,
      paymentAmount,
      paymentStatus,
      invoiceNumber,
    });
    await newPayable.save();
    res.status(201).json({
      message: 'Payable added successfully',
      newPayable,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding payable',
      error,
    });
  }
};

export const getAllReceivables = async (req, res) => {
  try {
    const receivables = await Receivables.find();
    res.status(200).json({
      message: 'Receivables retrieved successfully',
      results: receivables.length,
      receivables,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving receivables',
      error,
    });
  }
};

export const getAllPayables = async (req, res) => {
  try {
    const payables = await Payable.find();
    res.status(200).json({
      message: 'Payables retrieved successfully',
      results: payables.length,
      payables,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving payables',
      error,
    });
  }
};
