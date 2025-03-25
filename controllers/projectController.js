const prisma = require('../utils/prismaClient');

// ✅ CREATE PROJECT
const createProjectHandler = async (req, res) => {
  const { name, deadline, description } = req.body;

  try {
    const project = await prisma.projects.create({
      data: {
        name,
        deadline: new Date(deadline),
        description,
        owner_id: req.user.id,
      },
    });

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    console.error("❌ Error creating project:", error);
    res.status(500).json({ message: "Error creating project", error: error.message });
  }
};

// ✅ GET PROJECTS
const getProjectsHandler = async (req, res) => {
  try {
    const projects = await prisma.projects.findMany({
      where: {
        owner_id: req.user.id,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    res.json({ projects });
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    res.status(500).json({ message: "Failed to retrieve projects", error: error.message });
  }
};

// ✅ Export both functions
module.exports = {
  createProjectHandler,
  getProjectsHandler,
};

