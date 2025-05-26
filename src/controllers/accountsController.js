import Customer from '../models/Customer.js';
import Vendor from '../models/Vendor.js';
import Payable from '../models/Payables.js';
import Receivables from '../models/Receivables.js';
import Verification from '../models/Verification.js';
import sendMail from '../services/emailService.js';

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

// export const addPayable = async (req, res) => {
//   try {
//     const {
//       vendorId,
//       serviceType,
//       paymentAmount,
//       paymentStatus,
//       invoiceNumber,
//     } = req.body;

//     console.log(
//       vendorId,
//       serviceType,
//       paymentAmount,
//       paymentStatus,
//       invoiceNumber,
//     );

//     if (!vendorId || !serviceType || !paymentAmount || !paymentStatus)
//       return res.status(400).json({
//         message: 'All fields are required',
//       });

//     if (paymentStatus === 'done' && (!paymentAmount || !invoiceNumber)) {
//       return res.status(400).json({
//         message:
//           'Amount and Invoice Number are required when payment status is done',
//       });
//     }

//     console.log('finding vendor');
//     const vendor = await Vendor.findById(vendorId);
//     if (!vendor)
//       return res.status(404).json({
//         message: 'Vendor not found',
//       });

//     console.log('vendor found', vendor);
//     console.log('creating payable');

//     const newPayable = new Payable({
//       vendorId,
//       vendorName: vendor.name,
//       vendorMobile: vendor.mobile,
//       serviceType,
//       paymentAmount,
//       paymentStatus,
//       invoiceNumber,
//     });
//     await newPayable.save();
//     res.status(201).json({
//       message: 'Payable added successfully',
//       newPayable,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: 'Error adding payable',
//       error,
//     });
//   }
// };

export const addPayable = async (req, res) => {
  try {
    const {
      vendorId,
      serviceType,
      paymentAmount,
      paymentStatus,
      invoiceNumber,
    } = req.body; // Text fields are in req.body

    // The uploaded file (if any) is in req.file
    const qrCodeImageFile = req.file;

    console.log(
      'Request Body:',
      vendorId,
      serviceType,
      paymentAmount,
      paymentStatus,
      invoiceNumber,
    );
    if (qrCodeImageFile) {
      console.log(
        'Uploaded QR Code File:',
        qrCodeImageFile.originalname,
        qrCodeImageFile.mimetype,
        qrCodeImageFile.size,
      );
    }

    if (!vendorId || !serviceType || !paymentAmount || !paymentStatus) {
      return res.status(400).json({
        message:
          'Vendor ID, Service Type, Payment Amount, and Payment Status fields are required',
      });
    }

    if (paymentStatus === 'done' && (!paymentAmount || !invoiceNumber)) {
      return res.status(400).json({
        message:
          'Amount and Invoice Number are required when payment status is done',
      });
    }

    console.log('finding vendor');
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        message: 'Vendor not found',
      });
    }

    console.log('vendor found', vendor.name);
    console.log('creating payable');

    let qrCodeImageBase64 = '';
    if (qrCodeImageFile) {
      // Check file size again (multer should also do this, but good for safety)
      if (qrCodeImageFile.size > 1024 * 1024 * 1) {
        // 1MB
        return res
          .status(400)
          .json({ message: 'QR code image file too large (max 1MB).' });
      }
      // Convert the buffer to a Base64 string
      qrCodeImageBase64 = `data:${qrCodeImageFile.mimetype};base64,${qrCodeImageFile.buffer.toString('base64')}`;
    }

    const newPayable = new Payable({
      vendorId,
      vendorName: vendor.name,
      vendorMobile: vendor.mobile,
      serviceType,
      paymentAmount,
      paymentStatus,
      invoiceNumber,
      qrCodeImage: qrCodeImageBase64, // <<< --- SAVE THE BASE64 STRING
    });

    await newPayable.save();
    res.status(201).json({
      message: 'Payable added successfully',
      newPayable, // This will now include the qrCodeImage field
    });
  } catch (error) {
    console.error('Error adding payable:', error);
    // Multer specific error handling for file size
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res
          .status(400)
          .json({
            message: 'QR code image file is too large. Max 1MB allowed.',
          });
      }
    }
    // General error
    res.status(500).json({
      message: 'Error adding payable',
      error: error.message, // Send a cleaner error message
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

// controller for editing a receivable, the editable fields for a particular receivable are serviceType, paymentType, amount, paymentStatus, invoiceNumber
export const editReceivable = async (req, res) => {
  try {
    const { receivableId } = req.params;
    const { serviceType, paymentType, amount, paymentStatus, invoiceNumber } =
      req.body;

    if (
      !serviceType &&
      !paymentType &&
      !amount &&
      !paymentStatus &&
      !invoiceNumber
    )
      return res.status(400).json({
        message: 'At least one field is required',
      });

    const receivable = await Receivables.findById(receivableId);
    if (!receivable) {
      return res.status(404).json({
        message: 'No receivable found with that id',
      });
    }

    if (serviceType) receivable.serviceType = serviceType;
    if (paymentType) receivable.paymentType = paymentType;
    if (amount) receivable.amount = amount;
    if (paymentStatus) receivable.paymentStatus = paymentStatus;
    if (invoiceNumber) receivable.invoiceNumber = invoiceNumber;

    await receivable.save();
    res.status(200).json({
      message: 'Receivable updated successfully',
      receivable,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating receivable',
      error,
    });
  }
};

export const editPayable = async (req, res) => {
  try {
    const { payableId } = req.params;
    const { serviceType, paymentAmount, paymentStatus, invoiceNumber } =
      req.body;

    if (!serviceType && !paymentAmount && !paymentStatus && !invoiceNumber)
      return res.status(400).json({
        message: 'At least one field is required',
      });

    const payable = await Payable.findById(payableId);
    if (!payable) {
      return res.status(404).json({
        message: 'No payable found with that id',
      });
    }

    if (serviceType) payable.serviceType = serviceType;
    if (paymentAmount) payable.paymentAmount = paymentAmount;
    if (paymentStatus) payable.paymentStatus = paymentStatus;
    if (invoiceNumber) payable.invoiceNumber = invoiceNumber;

    await payable.save();
    res.status(200).json({
      message: 'Payable updated successfully',
      payable,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating payable',
      error,
    });
  }
};

export const requestPayableStatusChange = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const payable = await Payable.findById(id);
    if (!payable) {
      return res.status(404).json({
        message: 'No payable found with that id',
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Verification.create({
      payableId: id,
      otp,
      expiresAt,
    });

    await sendMail({
      to: 'mendt.otp@rprb2b.com',
      subject: 'OTP for Payable Status Change',
      text: `Your OTP for changing the status of payable ${payable.serviceType} for ${payable.vendorName} from ${payable.payableStatus} to ${status} is: ${otp}. This will expire in 10 minutes.`,
    });

    res.status(200).json({
      message: 'OTP sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error requesting payable status change',
      error,
    });
  }
};

export const verifyPayableStatusChange = async (req, res) => {
  try {
    const { id, otp, status } = req.body;
    const verification = await Verification.findOne({
      payableId: id,
      otp,
    });
    if (!verification) {
      return res.status(400).json({
        message: 'Invalid OTP',
      });
    }
    if (verification.expiresAt < new Date()) {
      return res.status(400).json({
        message: 'OTP has expired',
      });
    }
    const payable = await Payable.findByIdAndUpdate(
      id,
      { payableStatus: status },
      { new: true },
    );
    await Verification.deleteOne({ _id: verification._id });
    res.status(200).json({
      message: `Payable status changed to ${status} successfully`,
      payable,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error verifying payable status change',
      error,
    });
  }
};
