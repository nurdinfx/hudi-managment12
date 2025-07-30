export default {
  name: 'payment',
  title: 'Payment',
  type: 'document',
  fields: [
    {
      name: 'paymentId',
      title: 'Payment ID',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'referenceNumber',
      title: 'Reference Number',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'userId',
      title: 'User ID',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'roomId',
      title: 'Room ID',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'amount',
      title: 'Total Amount',
      type: 'number',
      validation: (Rule: any) => Rule.required().positive(),
    },
    {
      name: 'baseAmount',
      title: 'Base Amount',
      type: 'number',
      validation: (Rule: any) => Rule.required().positive(),
    },
    {
      name: 'feeAmount',
      title: 'Fee Amount',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: 'currency',
      title: 'Currency',
      type: 'string',
      options: {
        list: [
          { title: 'US Dollar', value: 'USD' },
          { title: 'Somali Shilling', value: 'SOS' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'EVC Plus', value: 'evc' },
          { title: 'Zaad', value: 'zaad' },
          { title: 'Sahal', value: 'sahal' },
          { title: 'Premier Bank', value: 'premier_bank' },
          { title: 'Amtel', value: 'amtel' },
          { title: 'Dahabshiil', value: 'dahabshiil' },
          { title: 'World Remit', value: 'world_remit' },
          { title: 'Taaj', value: 'taaj' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'status',
      title: 'Payment Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Completed', value: 'completed' },
          { title: 'Failed', value: 'failed' },
          { title: 'Expired', value: 'expired' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'checkinDate',
      title: 'Check-in Date',
      type: 'date',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'checkoutDate',
      title: 'Check-out Date',
      type: 'date',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'adults',
      title: 'Number of Adults',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'children',
      title: 'Number of Children',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: 'numberOfDays',
      title: 'Number of Days',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
      description: 'Phone number for mobile money payments',
    },
    {
      name: 'accountNumber',
      title: 'Account Number',
      type: 'string',
      description: 'Account number for bank transfers',
    },
    {
      name: 'expiresAt',
      title: 'Expires At',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'completedAt',
      title: 'Completed At',
      type: 'datetime',
    },
    {
      name: 'transactionId',
      title: 'Transaction ID',
      type: 'string',
      description: 'Transaction ID from payment provider',
    },
    {
      name: 'notes',
      title: 'Notes',
      type: 'text',
      description: 'Additional notes about the payment',
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      title: 'paymentId',
      subtitle: 'paymentMethod',
      amount: 'amount',
      status: 'status',
    },
    prepare(selection: any) {
      const { title, subtitle, amount, status } = selection;
      return {
        title: title,
        subtitle: `${subtitle} - $${amount} - ${status}`,
      };
    },
  },
}; 