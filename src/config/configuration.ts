export default () => ({
  productionBuild: process.env.PRODUCTION_BUILD === 'true',
  prefix: process.env.PREFIX ?? null,
  hostname: `http://localhost:${process.env.PORT || 3000}`,
  port: parseInt(process.env.PORT, 10) || 3000,
  mongoCluster:
    process.env.PRODUCTION_BUILD === 'true'
      ? `mongodb+srv://rejakazi02:jfXjbsUQVRj4MP26@ajia.yi24u.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
      : `mongodb+srv://rejakazi02:jfXjbsUQVRj4MP26@ajia.yi24u.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  // mongoCluster: `mongodb://127.0.0.1:${process.env.DB_PORT}/${process.env.DB_NAME}`,

  // JWT Token
  userJwtSecret: process.env.JWT_PRIVATE_KEY_USER,
  adminJwtSecret: process.env.JWT_PRIVATE_KEY_ADMIN,
  vendorJwtSecret: process.env.JWT_PRIVATE_KEY_VENDOR,
  userTokenExpiredDays: '7d',
  adminTokenExpiredDays: '7d',
  vendorTokenExpiredTime: '7d',
  promoOfferSchedule: 'Promo_Offer_Schedule',
  promoOfferScheduleOnStart: 'Promo_Offer_Schedule_On_Start',
  promoOfferScheduleOnEnd: 'Promo_Offer_Schedule_On_End',

  

  // Facebook Conversion Api
  fbPixelId: 'null',
  fbPixelAccessToken:
    'null',


});
