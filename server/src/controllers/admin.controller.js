const User = require('../models/user.model');
const AuditLog = require('../models/audit.model');
const AuditService = require('../services/audit.service');

class AdminController {
  // Get list of all users
  async getUsersList(req, res) {
    try {
      const users = await User.find({}, '-password');  // Exclude password field
      
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error('Get users list error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_USERS_FAILED',
          message: error.message
        }
      });
    }
  }

  // Update user role
  async updateUserRole(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ROLE',
            message: 'Invalid role specified'
          }
        });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true, select: '-password' }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found'
          }
        });
      }

      await AuditService.log('ROLE_UPDATE', req.user.userId, userId, {
        oldRole: user.role,
        newRole: role
      });

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Update user role error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_ROLE_FAILED',
          message: error.message
        }
      });
    }
  }

  // Update user status
  async updateUserStatus(req, res) {
    try {
      const { userId } = req.params;
      const { status } = req.body;

      if (!['active', 'disabled'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: 'Invalid status specified'
          }
        });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { status },
        { new: true, select: '-password' }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found'
          }
        });
      }

      await AuditService.log('STATUS_UPDATE', req.user.userId, userId, {
        oldStatus: user.status,
        newStatus: status
      });

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Update user status error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_STATUS_FAILED',
          message: error.message
        }
      });
    }
  }

  // Get system metrics
  async getSystemMetrics(req, res) {
    try {
      // Calculate 24h ago timestamp
      const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const metrics = {
        users: {
          total: await User.countDocuments(),
          active: await User.countDocuments({ status: 'active' }),
          disabled: await User.countDocuments({ status: 'disabled' }),
          new24h: await User.countDocuments({ createdAt: { $gte: last24h } })
        },
        roles: {
          admin: await User.countDocuments({ role: 'admin' }),
          user: await User.countDocuments({ role: 'user' })
        }
      };

      res.json({
        success: true,
        data: metrics
      });
    } catch (error) {
      console.error('Get system metrics error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_METRICS_FAILED',
          message: error.message
        }
      });
    }
  }

  // Get audit logs
  async getAuditLogs(req, res) {
    try {
      const { 
        page = 1, 
        limit = 20,
        action,
        startDate,
        endDate,
        userId 
      } = req.query;
      
      const filter = {};
      
      // Build filter conditions
      if (action) filter.action = action;
      if (userId) filter.userId = userId;
      if (startDate || endDate) {
        filter.timestamp = {};
        if (startDate) filter.timestamp.$gte = new Date(startDate);
        if (endDate) filter.timestamp.$lte = new Date(endDate);
      }

      const skip = (page - 1) * limit;

      const logs = await AuditLog.find(filter)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('userId', 'email')
        .populate('targetId', 'email');

      const total = await AuditLog.countDocuments(filter);

      res.json({
        success: true,
        data: {
          logs,
          pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get audit logs error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_LOGS_FAILED',
          message: error.message
        }
      });
    }
  }
}

module.exports = new AdminController(); 