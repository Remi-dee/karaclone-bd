export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  database: process.env.DB_URI,
  //JWT_SECRET: process.env.JWT_SECRET,
});
