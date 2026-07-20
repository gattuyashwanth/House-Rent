export const calculateBillTotal = (bill) => {
  const rent = Number(bill.rentAmount) || 0;
  const electricity = Number(bill.electricityBill) || 0;
  const water = Number(bill.waterBill) || 0;
  const maintenance = Number(bill.maintenanceBill) || 0;
  const generator = Number(bill.generatorCharges) || 0;
  return rent + electricity + water + maintenance + generator;
};
