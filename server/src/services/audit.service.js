const AuditLog = require('../models/audit.model');

class AuditService {
  static async log(action, userId, targetId = null, details = {}) {
    try {
      const log = new AuditLog({
        action,
        userId,
        targetId,
        details
      });
      await log.save();
    } catch (error) {
      console.error('Audit logging error:', error);
      // Don't throw - logging should not break main flow
    }
  }
}

module.exports = AuditService; 