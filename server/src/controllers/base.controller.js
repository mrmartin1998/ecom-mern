class BaseController {
  constructor(model) {
    this.model = model;
  }

  // GET /resource
  index = async (req, res) => {
    try {
      const items = await this.model.find();
      res.json({
        success: true,
        data: items,
        error: null,
        meta: {
          pagination: null // To be implemented
        }
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

  // GET /resource/:id
  show = async (req, res) => {
    try {
      const item = await this.model.findById(req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          data: null,
          error: {
            code: 'NOT_FOUND',
            message: 'Resource not found'
          },
          meta: null
        });
      }
      res.json({
        success: true,
        data: item,
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

  // POST /resource
  store = async (req, res) => {
    try {
      const item = new this.model(req.body);
      await item.save();
      res.status(201).json({
        success: true,
        data: item,
        error: null,
        meta: null
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message
        },
        meta: null
      });
    }
  }

  // PUT /resource/:id
  update = async (req, res) => {
    try {
      const item = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!item) {
        return res.status(404).json({
          success: false,
          data: null,
          error: {
            code: 'NOT_FOUND',
            message: 'Resource not found'
          },
          meta: null
        });
      }
      res.json({
        success: true,
        data: item,
        error: null,
        meta: null
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message
        },
        meta: null
      });
    }
  }

  // DELETE /resource/:id
  delete = async (req, res) => {
    try {
      const item = await this.model.findByIdAndDelete(req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          data: null,
          error: {
            code: 'NOT_FOUND',
            message: 'Resource not found'
          },
          meta: null
        });
      }
      res.json({
        success: true,
        data: item,
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

module.exports = BaseController; 