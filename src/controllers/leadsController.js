import Lead from '../models/Lead.js';
import Customer from '../models/Customer.js';

export const addNewLead = async (req, res) => {
  try {
    const {
      customerName,
      customerMobile,
      city,
      pinCode,
      email,
      firstCall,
      secondCall,
    } = req.body;

    if (
      !customerName ||
      !customerMobile ||
      !city ||
      !pinCode ||
      !email ||
      !firstCall
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingLead = await Lead.findOne({ customerMobile });
    if (existingLead) {
      return res.status(409).json({ message: 'Lead already exists' });
    }

    const newLead = await Lead.create({
      customerName,
      customerMobile,
      city,
      pinCode,
      email,
      firstCall,
      secondCall,
    });

    res.status(201).json({
      message: 'Lead added successfully',
      lead: newLead,
    });
  } catch (error) {
    console.error('Error adding new lead:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const moveLead = async (req, res) => {
  try {
    const { leadId, moveTo, remarks } = req.body;

    if (!leadId || !moveTo) {
      return res
        .status(400)
        .json({ message: 'Lead ID and moveTo are required' });
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const updateData = {
      [moveTo]: true,
      [`${moveTo}Remarks`]: remarks || null,
    };

    const updatedLead = await Lead.findByIdAndUpdate(leadId, updateData, {
      new: true,
    });

    res.status(200).json({
      message: `Lead moved to ${moveTo} successfully`,
      lead: updatedLead,
    });
  } catch (error) {
    console.error('Error moving lead:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const passToCustomer = async (req, res) => {
  try {
    const { leadId } = req.body;

    if (!leadId) {
      return res.status(400).json({ message: 'Lead ID is required' });
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    if (lead.passedToCustomer) {
      return res
        .status(409)
        .json({ message: 'Lead already passed to customer' });
    }

    lead.passedToCustomer = true;
    await lead.save();

    // create a new customer document using the leads mobile number and name
    const customer = await Customer.create({
      name: lead.customerName,
      mobile: lead.customerMobile,
    });

    res.status(200).json({
      message: 'Lead passed to customer successfully',
      lead,
    });
  } catch (error) {
    console.error('Error passing lead to customer:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
