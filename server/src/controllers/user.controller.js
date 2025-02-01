const BaseController = require('./base.controller');
const User = require('../models/user.model');

class UserController extends BaseController {
  constructor() {
    super(User);
  }

  // Override index to exclude passwords
  index = async (req, res) => {
    try {
      const users = await this.model.find().select('-password');
      res.json({
        success: true,
        data: users,
        error: null,
        meta: null
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        data: null,
        error: {
          code: 'DATABASE_ERROR',
          message: error.message
        },
        meta: null
      });
    }
  }
}

module.exports = UserController; 