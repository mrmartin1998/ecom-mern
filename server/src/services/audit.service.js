const AuditLog = require('../models/audit.model');

const auditService = {
  log: async (action, userId, targetId = null, details = {}) => {
    try {
      const log = new AuditLog({
        action,
        userId,
        targetId,
        details
      });
      await log.save();
      return log;
    } catch (error) {
      console.error('Audit logging error:', error);
      // Don't throw - we don't want audit logging to break main functionality
      return null;
    }
  },

  // Predefined audit actions
  actions: {
    USER_LOGIN: 'LOGIN',
    USER_LOGOUT: 'LOGOUT',
    USER_CREATED: 'USER_CREATE',
    USER_UPDATED: 'USER_UPDATE',
    USER_DELETED: 'USER_DELETE',
    ROLE_UPDATED: 'ROLE_UPDATE',
    STATUS_UPDATED: 'STATUS_UPDATE'
  }
};

module.exports = auditService; 