import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const tenantSchema = new mongoose.Schema(
  {
    flatNumber: {
      type: String,
      required: [true, "Flat number is required"],
      trim: true,
    },
    tenantName: {
      type: String,
      required: [true, "Tenant name is required"],
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    apartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Apartment",
      required: [true, "Apartment is required"],
    },
    floorNumber: {
      type: Number,
      required: [true, "Floor number is required"],
      min: 1,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      default: "tenant",
      enum: ["tenant"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

tenantSchema.index({ flatNumber: 1, apartmentId: 1 }, { unique: true });

tenantSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

tenantSchema.methods.comparePassword = async function (candidatePassword) {
  console.log("INPUT PASSWORD:", candidatePassword);
  console.log("STORED HASH:", this.password);

  const result = await bcrypt.compare(candidatePassword, this.password);

  console.log("COMPARE RESULT:", result);

  return result;
}

const Tenant = mongoose.model("Tenant", tenantSchema);
export default Tenant;
