const prisma = require('../utils/prismaClient');

// ✅ POST /api/notes
const createProjectNote = async (req, res) => {
  try {
    const { project_id, content } = req.body;

    if (!project_id || !content) {
      return res.status(400).json({ message: 'Project ID and content are required' });
    }

    const note = await prisma.project_notes.create({
      data: {
        project_id,
        user_id: req.user.id,
        content
      }
    });

    res.status(201).json({ message: 'Note added', note });
  } catch (error) {
    console.error('❌ Create Note Error:', error);
    res.status(500).json({ message: 'Error creating note', error: error.message });
  }
};

// ✅ GET /api/notes/:projectId
const getProjectNotes = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const notes = await prisma.project_notes.findMany({
      where: { project_id: projectId },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    res.json(notes);
  } catch (error) {
    console.error('❌ Get Notes Error:', error);
    res.status(500).json({ message: 'Error fetching notes', error: error.message });
  }
};

module.exports = {
  createProjectNote,
  getProjectNotes
};

