
export interface TransferHistory {
  _id?: string;
  readOnly?: boolean;
  orderNumber?: string[];
  orderIds?: string[];
  vendor?: string | any;
  dateString?: string;
  payable?: number;
  vendorPaymentTransferAmount?: number;
  vendorPaymentTransferStatus?: string;
}
