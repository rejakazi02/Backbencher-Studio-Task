

export interface Blog {
  _id?: string;
  readOnly?: boolean;
  name?: string;
  authorName?: string;
  vendor: any;
  title?: string;
  thumbnail?: string;
  postType?: string;
  formType?: string;
  slug?: string;
  image?: string;
  images?: string[];
  priority?: number;
  description?: string;
  eventDate?: string;
  endDate?: string;
  eventTime?: string;
  ticketPrice?: string;
  videoUrl?: string;
  contactDetails?: any;
  category?: any;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
}
