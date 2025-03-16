import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const BlogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },

    title: {
      type: String,
      required: false,
    },

    eventDate: {
      type: String,
      required: false,
    },
    endDate: {
      type: String,
      required: false,
    },
    blogAddDate: {
      type: String,
      required: false,
    },
    eventTime: {
      type: String,
      required: false,
    },
    endTime: {
      type: String,
      required: false,
    },
    ticketPrice: {
      type: Number,
      required: false,
    },
    venue: {
      type: String,
      required: false,
    },

    contentTag: {
      type: String,
      required: false,
    },
    contactDetails: {
      type: Object,
      required: false,
    },
    socialLinks: {
      type: Object,
      required: false,
    },

    formType: {
      type: String,
      required: false,
    },
    thumbnail: {
      type: String,
      required: false,
    },
    postType: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: false,
    },
    shortDesc: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    images: {
      type: [String],
      required: false,
    },
    docFiles: {
      type: [String],
      required: false,
    },
    bannerImage: {
      type: String,
      required: false,
    },
    priority: {
      type: Number,
      required: false,
      default: 0,
    },

    blogLikes: {
      type: Number,
      required: false,
      default: 0,
    },

    interested: {
      type: Number,
      required: false,
      default: 0,
    },
    blogLikesUser: {
      type: [String],
      required: false,
    },
    wishListUser: {
      type: [String],
      required: false,
    },
    interestedUser: {
      type: [String],
      required: false,
    },
    ticketPlaces: {
      type: [],
      required: false,
    },

    blogComments: {
      type: Number,
      required: false,
      default: 0,
    },
    status: {
      type: String,
      required: false,
    },
    userPublishStatus: {
      type: Boolean,
      required: false,
      default: true,
    },
    authorName: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },

    isFeatured: {
      type: Boolean,
      required: false,
    },
    isHeading: {
      type: Boolean,
      required: false,
    },
    category: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      slug: {
        type: String,
        required: false,
      },
    },

    subCategory: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      slug: {
        type: String,
        required: false,
      },
    },
    childCategory: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'ChildCategory',
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      slug: {
        type: String,
        required: false,
      },
    },
    vendor: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: false,
      },
      name: {
        type: String,
        required: false,
      },

      profileImg: {
        type: String,
        required: false,
      },
      phoneNo: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: false,
      },

      address: {
        type: String,
        required: false,
      },
      profession: {
        type: String,
        required: false,
      },
      userType: {
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
