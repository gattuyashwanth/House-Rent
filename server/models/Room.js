import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
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
    roomNumber: {
      type: String,
      required: [true, "Room/flat number is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Occupied", "Vacant"],
      default: "Vacant",
    },
  },
  { timestamps: true }
);

roomSchema.index({ apartmentId: 1, roomNumber: 1 }, { unique: true });

const Room = mongoose.model("Room", roomSchema);
export default Room;
