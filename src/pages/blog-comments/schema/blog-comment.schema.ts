import * as mongoose from 'mongoose';
// const mongoose = require('mongoose');
const Schema = mongoose.Schema;
export const BlogCommentSchema = new mongoose.Schema(
  {
    readOnly: {
      type: Boolean,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    user: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      name: {
        type: String,
      },
      profileImg: {
        type: String,
      },
    },
    blog: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Blogs',
      },
      title: {
        type: String,
      },
      images: {
        type: [String],
      },
      slug: {
        type: String,
      },
      formType: {
        type: String,
      },
    },

    vendor: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Blogs',
      },
      name: {
        type: String,
      },
    },
    reviewDate: {
      type: Date,
      required: false,
      default: Date.now(),
    },
    review: {
      type: String,
      required: true,
    },
    isReview: {
      type: Boolean,
      required: false,
    },
    isComment: {
      type: Boolean,
      required: false,
    },
    rating: {
      type: Number,
      required: false,
    },
    totalLike: {
      type: Number,
      required: false,
      default: 0,
    },
    likedBy: [{ type: String, required: false }],
    status: {
      type: Boolean,
      required: true,
    },
    // reply: {
    //   type: String,
    //   required: false,
    // },
    reply: [
      {
        user: {
          _id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
          },
          name: {
            type: String,
          },
          profileImg: {
            type: String,
          },
        },
        vendor: {
          _id: {
            type: Schema.Types.ObjectId,
            ref: 'Blogs',
          },
          name: {
            type: String,
          },
        },
        replyDate: {
          type: Date,
          required: false,
          default: Date.now(),
        },
        replyText: {
          type: String,
          required: false,
        },
        totalLike: {
          type: Number,
          required: false,
          default: 0,
        },
        likedBy: [{ type: String, required: false }],
        replies: [
          {
            user: {
              _id: {
                type: Schema.Types.ObjectId,
                ref: 'User',
              },
              name: {
                type: String,
              },
              profileImg: {
                type: String,
              },
            },
            vendor: {
              _id: {
                type: Schema.Types.ObjectId,
                ref: 'Blogs',
              },
              name: {
                type: String,
              },
            },
            replyDate: {
              type: Date,
              required: false,
              default: Date.now(),
            },
            replyText: {
              type: String,
              required: false,
            },
            totalLike: {
              type: Number,
              required: false,
              default: 0,
            },
            likedBy: [{ type: String, required: false }],
          },
        ],
      },
    ],
    replyDate: {
      type: Date,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    phoneNo: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    message: {
      type: String,
      required: false,
    },
    emailSent: {
      type: Boolean,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
