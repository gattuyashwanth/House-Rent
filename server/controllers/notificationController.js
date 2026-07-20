import Notification from "../models/Notification.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.isRead !== undefined) {
    filter.isRead = req.query.isRead === "true";
  }

  const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(50);
  const unreadCount = await Notification.countDocuments({ isRead: false });

  res.status(200).json({
    success: true,
    count: notifications.length,
    unreadCount,
    data: notifications,
  });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );
  if (!notification) throw new ApiError(404, "Notification not found");
  res.status(200).json({ success: true, data: notification });
});

export const markAllNotificationsRead = asyncHandler(async (_req, res) => {
  await Notification.updateMany({ isRead: false }, { isRead: true });
  res.status(200).json({ success: true, message: "All notifications marked as read" });
});
