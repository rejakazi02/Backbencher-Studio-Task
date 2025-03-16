
import {Blog} from '../../blog/interfaces/blog.interface';


export interface BlogComment {
  _id?: string;
  readOnly?: boolean;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  queryType?: string;
  subject?: string;
  message?: string;
  receivingMails?: string;
  emailSent?: string;
  user?: string | any;
  product?: string | any;
  blog?: string | Blog;
  // name?: string;
  reviewDate: string;
  review: string;
  rating: number;
  status: boolean;
  isReview: boolean;
  reply: string;
  replyDate: string;
}
