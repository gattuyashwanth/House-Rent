export const mapApartment = (apt) => ({
  id: apt._id,
  name: apt.apartmentName,
  address: apt.address,
  city: apt.city,
  totalFloors: apt.totalFloors,
  image: apt.image,
  availableRooms: 0, // Will be computed dynamically in AppContext
});

export const mapFloor = (fl) => ({
  id: fl._id,
  apartmentId: fl.apartmentId?._id || fl.apartmentId,
  floorNumber: fl.floorNumber,
  name: `Floor ${fl.floorNumber}`,
});

export const mapRoom = (rm, floors = []) => {
  const aptId = rm.apartmentId?._id || rm.apartmentId;
  const floor = floors.find(
    (f) => f.apartmentId === aptId && f.floorNumber === rm.floorNumber
  );
  return {
    id: rm._id,
    apartmentId: aptId,
    roomNumber: rm.roomNumber,
    status: rm.status ? rm.status.toLowerCase() : "vacant",
    floorNumber: rm.floorNumber,
    floorId: floor ? floor.id : "",
  };
};

export const mapTenant = (t) => ({
  id: t._id,
  name: t.tenantName,
  roomNumber: t.flatNumber,
  contact: t.mobileNumber,
  email: t.email || "",
  apartmentId: t.apartmentId?._id || t.apartmentId,
  apartmentName: t.apartmentId?.apartmentName || "",
  floorNumber: t.floorNumber,
  profilePicture: t.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
  moveInDate: t.createdAt ? t.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
  role: t.role,
  isActive: t.isActive,
});

export const mapBill = (b) => ({
  id: b._id,
  tenantId: b.tenantId?._id || b.tenantId,
  tenantName: b.tenantId?.tenantName || "",
  roomNumber: b.roomNumber,
  apartmentId: b.apartmentId?._id || b.apartmentId,
  apartmentName: b.apartmentId?.apartmentName || "",
  month: b.month && b.year ? `${b.year}-${String(b.month).padStart(2, "0")}` : "2026-06",
  houseRent: b.rentAmount,
  electricity: b.electricityBill,
  water: b.waterBill,
  maintenance: b.maintenanceBill,
  generator: b.generatorCharges,
  total: b.totalAmount,
  status: b.paymentStatus ? b.paymentStatus.toLowerCase() : "pending",
});

export const mapComplaint = (c) => ({
  id: c._id,
  tenantId: c.tenantId?._id || c.tenantId,
  tenantName: c.tenantId?.tenantName || c.tenantName || "",
  roomNumber: c.roomNumber,
  apartmentId: c.apartmentId?._id || c.apartmentId,
  category: c.complaintType,
  description: c.description,
  image: c.image,
  status: c.status ? c.status.toLowerCase() : "pending",
  createdAt: c.createdAt,
});

export const mapNotification = (n) => ({
  id: n._id,
  type: n.type,
  title: n.title,
  message: n.message,
  read: n.isRead,
  createdAt: n.createdAt,
});
