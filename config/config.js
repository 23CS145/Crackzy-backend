module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  ADMIN_CREATION_SECRET: process.env.ADMIN_CREATION_SECRET || 'admin-secret-123',
};