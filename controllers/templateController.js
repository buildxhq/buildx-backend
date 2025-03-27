const prisma = require('../utils/prismaClient');

// ✅ POST /api/templates
const createTemplate = async (req, res) => {
  try {
    const { name, description, trades, valueEstimate } = req.body;

    const template = await prisma.project_templates.create({
      data: {
        owner_id: req.user.id,
        name,
        description,
        trades,
        valueEstimate,
      },
    });

    res.status(201).json({ message: 'Template saved', template });
  } catch (err) {
    console.error('❌ Save Template Error:', err);
    res.status(500).json({ message: 'Failed to save template', error: err.message });
  }
};

// ✅ GET /api/templates
const getTemplates = async (req, res) => {
  try {
    const templates = await prisma.project_templates.findMany({
      where: { owner_id: req.user.id }
    });

    res.json(templates);
  } catch (err) {
    console.error('❌ Get Templates Error:', err);
    res.status(500).json({ message: 'Failed to fetch templates', error: err.message });
  }
};

module.exports = { createTemplate, getTemplates };
