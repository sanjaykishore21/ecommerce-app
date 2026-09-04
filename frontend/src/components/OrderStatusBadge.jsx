import React from 'react';
import { Clock, RefreshCw, Truck, CheckCircle, XCircle } from 'lucide-react';

export const OrderStatusBadge = ({ status }) => {
  const getBadgeConfig = (st) => {
    switch (st?.toUpperCase()) {
      case 'PENDING':
        return {
          label: 'Pending',
          className: 'status-pill status-pending',
          Icon: Clock,
        };
      case 'PROCESSING':
        return {
          label: 'Processing',
          className: 'status-pill status-processing',
          Icon: RefreshCw,
        };
      case 'SHIPPED':
        return {
          label: 'Shipped',
          className: 'status-pill status-shipped',
          Icon: Truck,
        };
      case 'DELIVERED':
        return {
          label: 'Delivered',
          className: 'status-pill status-delivered',
          Icon: CheckCircle,
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          className: 'status-pill status-cancelled',
          Icon: XCircle,
        };
      default:
        return {
          label: st || 'Unknown',
          className: 'status-pill status-pending',
          Icon: Clock,
        };
    }
  };

  const { label, className, Icon } = getBadgeConfig(status);

  return (
    <span className={className}>
      <Icon size={14} />
      <span>{label}</span>
    </span>
  );
};
