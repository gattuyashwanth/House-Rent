import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "Tenant ID is required"],
    },
    apartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Apartment",
      required: [true, "Apartment ID is required"],
    },
    roomNumber: {
      type: String,
      required: [true, "Room number is required"],
      trim: true,
    },
    month: {
      type: Number,
      required: [true, "Month is required"],
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: 2000,
    },
    rentAmount: { type: Number, required: true, min: 0, default: 0 },
    electricityBill: { type: Number, min: 0, default: 0 },
    waterBill: { type: Number, min: 0, default: 0 },
    maintenanceBill: { type: Number, min: 0, default: 0 },
    generatorCharges: { type: Number, min: 0, default: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Overdue"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

billSchema.index({ tenantId: 1, month: 1, year: 1 }, { unique: true });

const Bill = mongoose.model("Bill", billSchema);
export default Bill;
