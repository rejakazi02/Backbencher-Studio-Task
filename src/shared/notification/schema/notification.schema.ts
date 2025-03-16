import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const NotificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      required: false,
      default: false,
    },
    url: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    page: {
      type: String,
      required: false,
    },

    type: {
      type: String,
      required: false,
    },

    vendor: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
      },
      name: {
        type: String,
        required: false,
      },
      phoneNo: {
        type: String,
        required: false,
      },
      profileImg: {
        type: String,
        required: false,
      },
      userType: {
        type: String,
        required: false,
      },
    },

    user: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      phoneNo: {
        type: String,
        required: false,
      },
      userType: {
        type: String,
        required: false,
      },
      profileImg: {
        type: String,
        required: false,
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
