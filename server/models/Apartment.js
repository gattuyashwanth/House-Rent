import mongoose from "mongoose";

const apartmentSchema = new mongoose.Schema(
  {
    apartmentName: {
      type: String,
      required: [true, "Apartment name is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    totalFloors: {
      type: Number,
      required: [true, "Total floors is required"],
      min: 1,
    },
    image: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Apartment = mongoose.model("Apartment", apartmentSchema);
export default Apartment;
