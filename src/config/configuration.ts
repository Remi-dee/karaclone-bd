export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  database: process.env.DB_URI,
  jwtSecret: process.env.JWT_SECRET,
});
