export interface Notification {
  _id?: string;
  name?: string;
  isRead?: boolean;
  isDeliveryRequest?: boolean;
  url?: string;
  image?: string;
  description?: string;
  vendorAssign?: string;
  orderId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
