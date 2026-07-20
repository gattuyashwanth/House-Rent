import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";
import Apartment from "../models/Apartment.js";
import Bill from "../models/Bill.js";
import Complaint from "../models/Complaint.js";
import Floor from "../models/Floor.js";
import Notification from "../models/Notification.js";
import Room from "../models/Room.js";
import Tenant from "../models/Tenant.js";
import { calculateBillTotal } from "./calculateBillTotal.js";

dotenv.config();

const seedData = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    Admin.deleteMany(),
    Tenant.deleteMany(),
    Apartment.deleteMany(),
    Floor.deleteMany(),
    Room.deleteMany(),
    Bill.deleteMany(),
    Complaint.deleteMany(),
    Notification.deleteMany(),
  ]);

  console.log("Creating admin...");
  await Admin.create({
    username: "admin",
    password: "admin123",
    role: "admin",
  });
  await Admin.create({
    username: "gattuyashwanth22@gmail.com",
    password: "Gattu",
    role: "admin",
  });

  console.log("Creating apartments...");
  const apartments = await Apartment.insertMany([
    {
      apartmentName: "Sri Lakshmi Residency",
      address: "Plot No. 45, Madhapur, Hyderabad - 500081",
      city: "Hyderabad",
      totalFloors: 3,
      image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=400&fit=crop",
    },
    {
      apartmentName: "Sai Balaji Apartments",
      address: "Benz Circle, Vijayawada - 520010",
      city: "Vijayawada",
      totalFloors: 3,
      image: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=600&h=400&fit=crop",
    },
    {
      apartmentName: "Green Valley Residency",
      address: "Beach Road, Visakhapatnam - 530003",
      city: "Visakhapatnam",
      totalFloors: 3,
      image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600&h=400&fit=crop",
    },
  ]);

  const [apt1, apt2, apt3] = apartments;

  console.log("Creating floors...");
  const floorData = [];
  for (const apt of apartments) {
    for (let f = 1; f <= apt.totalFloors; f++) {
      floorData.push({ apartmentId: apt._id, floorNumber: f });
    }
  }
  await Floor.insertMany(floorData);

  console.log("Creating rooms...");
  const roomData = [];
  const roomConfigs = [
    { apt: apt1, floors: 3 },
    { apt: apt2, floors: 3 },
    { apt: apt3, floors: 3 },
  ];

  for (const { apt, floors } of roomConfigs) {
    for (let f = 1; f <= floors; f++) {
      for (let r = 1; r <= 3; r++) {
        roomData.push({
          apartmentId: apt._id,
          floorNumber: f,
          roomNumber: `${f}0${r}`,
          status: "Vacant",
        });
      }
    }
  }
  await Room.insertMany(roomData);

  console.log("Creating tenants...");
  const tenantData = [
    { flatNumber: "101", tenantName: "Ravi Kumar", mobileNumber: "+91 9876543210", apartmentId: apt1._id, floorNumber: 1 },
    { flatNumber: "103", tenantName: "Priya Sharma", mobileNumber: "+91 9876543211", apartmentId: apt1._id, floorNumber: 1 },
    { flatNumber: "202", tenantName: "Suresh Reddy", mobileNumber: "+91 9876543212", apartmentId: apt1._id, floorNumber: 2 },
    { flatNumber: "101", tenantName: "Lakshmi Devi", mobileNumber: "+91 9876543213", apartmentId: apt2._id, floorNumber: 1 },
    { flatNumber: "201", tenantName: "Anil Kumar", mobileNumber: "+91 9876543214", apartmentId: apt2._id, floorNumber: 2 },
    { flatNumber: "101", tenantName: "Rajesh Naidu", mobileNumber: "+91 9876543215", apartmentId: apt3._id, floorNumber: 1 },
  ];
  const tenants = [];
  for (const t of tenantData) {
    tenants.push(await Tenant.create({ ...t, password: "tenant123", isActive: true }));
  }

  const occupiedFlats = [
    { aptId: apt1._id, flat: "101" },
    { aptId: apt1._id, flat: "103" },
    { aptId: apt1._id, flat: "202" },
    { aptId: apt2._id, flat: "101" },
    { aptId: apt2._id, flat: "201" },
    { aptId: apt3._id, flat: "101" },
  ];

  for (const { aptId, flat } of occupiedFlats) {
    await Room.findOneAndUpdate(
      { apartmentId: aptId, roomNumber: flat },
      { status: "Occupied" }
    );
  }

  console.log("Creating bills...");
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const billTemplates = [
    { tenant: tenants[0], apt: apt1, flat: "101", rent: 12000, elec: 1850, water: 450, maint: 1200, gen: 500, status: "Pending" },
    { tenant: tenants[1], apt: apt1, flat: "103", rent: 10000, elec: 2100, water: 380, maint: 1000, gen: 400, status: "Pending" },
    { tenant: tenants[2], apt: apt1, flat: "202", rent: 15000, elec: 2800, water: 520, maint: 1500, gen: 600, status: "Overdue" },
    { tenant: tenants[3], apt: apt2, flat: "101", rent: 14000, elec: 1200, water: 350, maint: 1100, gen: 450, status: "Paid" },
    { tenant: tenants[4], apt: apt2, flat: "201", rent: 16000, elec: 1950, water: 480, maint: 1300, gen: 550, status: "Pending" },
    { tenant: tenants[5], apt: apt3, flat: "101", rent: 18000, elec: 2200, water: 500, maint: 1400, gen: 600, status: "Paid" },
  ];

  for (const b of billTemplates) {
    const body = {
      tenantId: b.tenant._id,
      apartmentId: b.apt._id,
      roomNumber: b.flat,
      month,
      year,
      rentAmount: b.rent,
      electricityBill: b.elec,
      waterBill: b.water,
      maintenanceBill: b.maint,
      generatorCharges: b.gen,
      paymentStatus: b.status,
    };
    await Bill.create({ ...body, totalAmount: calculateBillTotal(body) });
  }

  console.log("Creating complaints...");
  await Complaint.insertMany([
    {
      tenantId: tenants[0]._id,
      apartmentId: apt1._id,
      roomNumber: "101",
      complaintType: "Water Leakage",
      description: "Water leakage from bathroom ceiling during monsoon.",
      status: "Pending",
    },
    {
      tenantId: tenants[1]._id,
      apartmentId: apt1._id,
      roomNumber: "103",
      complaintType: "Power Issue",
      description: "Frequent power tripping in the flat. MCB needs inspection.",
      status: "In Progress",
    },
    {
      tenantId: tenants[3]._id,
      apartmentId: apt2._id,
      roomNumber: "101",
      complaintType: "Drainage Issue",
      description: "Kitchen sink drainage blocked. Water backing up.",
      status: "Pending",
    },
    {
      tenantId: tenants[5]._id,
      apartmentId: apt3._id,
      roomNumber: "101",
      complaintType: "Lift Problem",
      description: "Lift making loud noise on ground floor.",
      status: "In Progress",
    },
  ]);

  console.log("Creating notifications...");
  await Notification.insertMany([
    {
      title: "New Complaint",
      message: "Ravi Kumar submitted a Water Leakage complaint from Flat 101.",
      type: "complaint",
      isRead: false,
      tenantId: tenants[0]._id,
    },
    {
      title: "Rent Overdue",
      message: "Suresh Reddy's monthly bill of ₹20,420 is overdue.",
      type: "payment",
      isRead: false,
      tenantId: tenants[2]._id,
    },
    {
      title: "Complaint Update",
      message: "Priya Sharma's Power Issue complaint is now In Progress.",
      type: "complaint",
      isRead: true,
      tenantId: tenants[1]._id,
    },
  ]);

  console.log("\n✅ Seed completed successfully!\n");
  console.log("Admin Login:  username=admin  password=admin123");
  console.log("Tenant Login: flatNumber=101  password=tenant123  (Ravi Kumar)\n");

  await mongoose.connection.close();
  process.exit(0);
};

seedData().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
