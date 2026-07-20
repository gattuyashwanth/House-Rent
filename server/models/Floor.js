import mongoose from "mongoose";

const floorSchema = new mongoose.Schema(
  {
    apartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Apartment",
      required: [true, "Apartment ID is required"],
    },
    floorNumber: {
      type: Number,
      required: [true, "Floor number is required"],
      min: 1,
    },
  },
  { timestamps: true }
);

floorSchema.index({ apartmentId: 1, floorNumber: 1 }, { unique: true });

const Floor = mongoose.model("Floor", floorSchema);
export default Floor;
