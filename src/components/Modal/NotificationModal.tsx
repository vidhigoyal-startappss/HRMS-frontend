import React, { useEffect, useRef } from "react";
import {
  X,
  Cake,
  UserPlus,
  CalendarCheck,
  PartyPopper,
  Bell,
  Trash2,
} from "lucide-react";

interface Notification {
  id: string;
  message: string;
  time: string;
  type: "birthday" | "leave" | "new_user" | "anniversary" | "general";
  isRead: boolean;
}

interface NotificationModalProps {
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const getIconForType = (type: Notification["type"]) => {
  switch (type) {
    case "birthday":
      return <Cake className="text-pink-500" size={18} />;
    case "leave":
      return <CalendarCheck className="text-green-500" size={18} />;
    case "new_user":
      return <UserPlus className="text-blue-500" size={18} />;
    case "anniversary":
      return <PartyPopper className="text-yellow-500" size={18} />;
    default:
      return <Bell className="text-gray-400" size={18} />;
  }
};

const NotificationModal: React.FC<NotificationModalProps> = ({
  onClose,
  notifications,
  onMarkAsRead,
  onDelete,
  onMarkAllAsRead,
}) => {
  const unread = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead);
  const notificationModalRef = useRef(null)


  useEffect(()=>{
      const handleClickOutside = (event) =>{
      if(notificationModalRef.current && !notificationModalRef.current.contains(event.target)){
        onClose()
      }
  }
  document.addEventListener('mousedown',handleClickOutside)
  return () =>{
    document.removeEventListener('mousedown', handleClickOutside);
  }
        
  },[onClose])

  const renderNotification = (n: Notification) => (
    <div
      key={n.id}
      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 flex gap-3 items-start ${
        n.isRead ? "opacity-60" : "bg-blue-50"
      }`}
    >
      <div className="pt-1 relative">
        {getIconForType(n.type)}
        {!n.isRead && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-[#113F67]">{n.message}</p>
        <p className="text-xs text-gray-500">{n.createdAt}</p>
        {!n.isRead && (
          <button
            onClick={() => onMarkAsRead(n._id)}
            className="text-xs text-blue-600 hover:underline mt-1 cursor-pointer"
          >
            Mark as read
          </button>
        )}
      </div>
      <button
        onClick={() => onDelete(n._id)}
        className="text-gray-400 hover:text-red-500 cursor-pointer"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <div className="fixed top-16 right-4 sm:right-6 z-50 w-[90%] max-w-sm sm:w-80 bg-white rounded-xl shadow-xl border border-gray-300" ref={notificationModalRef}>
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
        <h2 className="font-bold text-[#113F67] text-sm sm:text-base">
          Notifications
        </h2>
        <div className="flex items-center gap-2 sm:gap-3">
          {unread.length > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-xs sm:text-sm text-blue-600 hover:underline whitespace-nowrap cursor-pointer"
            >
              Mark all as read
            </button>
          )}
          <button onClick={onClose} className="text-[#113F67] cursor-pointer">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="max-h-80 sm:max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-gray-500 cursor-pointer">
            No notifications yet
          </div>
        ) : (
          <>
            {unread.length > 0 && (
              <>
                <p className="px-4 py-1 text-xs font-semibold text-gray-500">
                  New
                </p>
                {unread.map(renderNotification)}
              </>
            )}
            {read.length > 0 && (
              <>
                <p className="px-4 py-1 text-xs font-semibold text-gray-400 mt-2">
                  Earlier
                </p>
                {read.map(renderNotification)}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;
