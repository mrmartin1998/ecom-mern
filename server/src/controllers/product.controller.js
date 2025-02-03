const BaseController = require('./base.controller');
const Product = require('../models/product.model');
const { AppError } = require('../utils/errorHandler');
const cache = require('../services/cache.service');

class ProductController extends BaseController {
  constructor() {
    super(Product);
  }

  // Get products with filtering, sorting, and pagination
  index = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      
      // Build query
      const query = {};
      if (req.query.category) {
        query.category = req.query.category;
      }
      if (req.query.search) {
        query.$or = [
          { name: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } }
        ];
      }

      // Build sort
      let sort = {};
      switch (req.query.sort) {
        case 'price_asc':
          sort = { price: 1 };
          break;
        case 'price_desc':
          sort = { price: -1 };
          break;
        case 'date_asc':
          sort = { createdAt: 1 };
          break;
        case 'date_desc':
          sort = { createdAt: -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }

      // Check cache
      const cacheKey = `products:${JSON.stringify({ query, sort, page, limit })}`;
      const cachedResult = await cache.get(cacheKey);
      
      if (cachedResult) {
        return res.json({
          success: true,
          data: cachedResult.data,
          error: null,
          meta: cachedResult.meta
        });
      }

      // Execute query
      const [products, total] = await Promise.all([
        Product.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit),
        Product.countDocuments(query)
      ]);

      const result = {
        data: products,
        meta: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };

      // Cache result
      await cache.set(cacheKey, result, 300); // Cache for 5 minutes

      res.json({
        success: true,
        ...result,
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  // Create product (admin only)
  store = async (req, res) => {
    try {
      const product = new Product(req.body);
      
      if (req.file) {
        // Handle image upload if implemented
        product.imageUrl = req.file.path;
      }
      
      await product.save();
      await cache.clear('products:*'); // Clear products cache
      
      res.status(201).json({
        success: true,
        data: product,
        error: null,
        meta: null
      });
    } catch (error) {
      next(error);
    }
  }

  // Bulk operations (admin only)
  bulkUpdate = async (req, res) => {
    try {
      const { operations } = req.body;
      const results = await Promise.all(
        operations.map(async op => {
          const product = await Product.findById(op.id);
          if (!product) return { id: op.id, success: false, error: 'Product not found' };
          
          Object.assign(product, op.data);
          await product.save();
          return { id: op.id, success: true, data: product };
        })
      );

      await cache.clear('products:*'); // Clear products cache
      
      res.json({
        success: true,
        data: results,
        error: null,
        meta: null
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController; 