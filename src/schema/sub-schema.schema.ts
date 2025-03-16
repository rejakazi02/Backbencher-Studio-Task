import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const ORDER_ITEM_SCHEMA = new mongoose.Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    salePrice: {
      type: Number,
      required: false,
    },
    commission: {
      type: Number,
      required: false,
    },
    selectedQuantity: {
      type: Number,
      required: true,
    },
    discountType: {
      type: Number,
      required: false,
    },
    discountAmount: {
      type: Number,
      required: false,
    },
    variation: {
      _id: {
        type: String,
        required: false,
      },

      name: {
        type: String,
        required: false,
      },
      sku: {
        type: String,
        required: false,
      },
    },

    isReview: {
      type: Schema.Types.ObjectId,
      ref: 'Review',
      required: false,
    },
    category: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },
      name: {
        type: String,
      },
      slug: {
        type: String,
      },
    },
    subCategory: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory',
      },
      name: {
        type: String,
      },
      slug: {
        type: String,
      },
    },
    childCategory: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'ChildCategory',
      },
      name: {
        type: String,
      },
      slug: {
        type: String,
      },
    },
    refundAmount: {
      type: Number,
      required: false,
    },
    returnQuantity: {
      type: Number,
      required: false,
    },
    returnStatus: {
      type: String,
      required: false,
    },
    returnNote: {
      type: String,
      required: false,
    },
  },
  {
    _id: true,
  },
);

export const PACKAGES_SCHEMA = new mongoose.Schema(
  {
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
    },
    shopName: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: false,
    },
    refundNote: {
      type: String,
      required: false,
    },

    deliveryDate: {
      type: Date,
      required: false,
    },
    paidAmount: {
      type: Number,
      required: false,
      default: 0,
    },
    subTotal: {
      type: Number,
      required: false,
    },

    discount: {
      type: Number,
      required: false,
    },
    deliveryCharge: {
      type: Number,
      required: false,
    },
    tax: {
      type: Number,
      required: false,
      default: 0,
    },
    total: {
      type: Number,
      required: false,
    },
    commission: {
      type: Number,
      required: false,
    },

    orderItems: [ORDER_ITEM_SCHEMA],
    orderTimeline: {
      type: Object,
      required: false,
    },
    vendorPaymentStatus: {
      type: String,
      required: false,
    },
    preferableDate: {
      type: String,
      required: false,
    },
    preferableTime: {
      type: String,
      required: false,
    },
    paymentOptions: {
      type: String,
      required: false,
    },
    trackingNumber: {
      type: String,
      required: false,
    },
    shippingProviderUrl: {
      type: String,
      required: false,
    },
    shippingProvider: {
      type: String,
      required: false,
    },
    vendorNote: {
      type: String,
      required: false,
    },
    shippedDate: {
      type: String,
      required: false,
    },
    expectedDate: {
      type: String,
      required: false,
    },
  },
  {
    _id: true,
  },
);

export const VARIATION_LIST = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    sku: {
      type: String,
      required: false,
    },
    salePrice: {
      type: Number,
      required: false,
    },
    discountType: {
      type: Number,
      required: false,
    },
    discountAmount: {
      type: Number,
      required: false,
    },
    quantity: {
      type: Number,
      required: false,
      default: 0,
    },

    trackQuantity: {
      type: Number,
      required: false,
      default: 0,
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    _id: true,
  },
);
