const express = require('express');
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// list products (with optional search)
router.get('/', async (req, res) => {
  try {
    const q = req.query.q;
    if (q) {
      const re = new RegExp(q, 'i');
      const results = await Product.find({ $or: [{ name: re }, { category: re }, { description: re }] }).limit(200);
      return res.json(results);
    }
    const all = await Product.find().limit(500);
    // If DB is empty OR contains fewer products than our static data file, seed missing products
    const dataPath = path.join(__dirname, '..', '..', 'data', 'products.json');
    let pdata = [];
    try {
      const fileContent = fs.readFileSync(dataPath, 'utf8');
      pdata = JSON.parse(fileContent) || [];
    } catch (e) {
      console.warn('Products data file missing or invalid:', e.message);
    }

    if (all.length === 0 && pdata.length > 0) {
      try {
        const normalized = pdata.map(p => ({ ...p, id: p.id || undefined }));
        const inserted = await Product.insertMany(normalized);
        console.log('✓ Seeded', inserted.length, 'products into MongoDB');
        return res.json(inserted);
      } catch (err) {
        console.error('✗ Error seeding products:', err.message);
        return res.status(500).json({ error: 'Failed to seed products: ' + err.message });
      }
    }

    // If DB has fewer items than the data file, insert missing records (no duplicates by name)
    if (pdata.length > 0 && all.length < pdata.length) {
      try {
        const existingNames = new Set(all.map(x => x.name));
        const toInsert = pdata.filter(p => !existingNames.has(p.name)).map(p => ({ ...p, id: p.id || undefined }));
        if (toInsert.length > 0) {
          const inserted = await Product.insertMany(toInsert);
          console.log('✓ Inserted', inserted.length, 'missing products to MongoDB');
        }
      } catch (err) {
        console.error('✗ Error inserting missing products:', err.message);
      }
    }

    // Return current DB products
    res.json(await Product.find().limit(500));
  } catch (err) {
    console.error('✗ Error fetching products:', err.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// get single product
router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id).catch(() => null);
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// delete product
router.delete('/:id', async (req, res) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
