const prisma = require('../utils/prismaClient');
const sendEmail = require('../utils/sendEmail');

const requestRebid = async (req, res) => {
  try {
    const { project_id, message } = req.body;

    const project = await prisma.projects.findUnique({ where: { id: project_id } });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const rebid = await prisma.rebid_requests.create({
      data: {
        project_id,
        requested_by: req.user.id,
        message,
      }
    });

    // Notify all bidders on that project
    const bidders = await prisma.bids.findMany({
      where: { project_id },
      include: { user: true }
    });

    for (const bid of bidders) {
      if (bid.user?.email) {
        await sendEmail(bid.user.email, {
          subject: ` M- 🔁 Rebid Requested for Project: ${project.name}`,
          body: `
            <p>The project <strong>${project.name}</strong> has requested new bids.</p>
            <p><strong>Message from GC:</strong> ${message}</p>
            <p>
              View updated project and submit your new bid:<br>
              <a href="${process.env.FRONTEND_URL}/projects/${project_id}">Submit New Bid</a>
            </p>
          `
        });
      }

      await prisma.notifications.create({
        data: {
          user_id: bid.user_id,
          message: `🔁 Rebid requested for project: ${project.name}`,
          link: `/projects/${project_id}`
        }
      });
    }

    res.json({ message: 'Rebid request sent', rebid });
  } catch (err) {
    console.error('❌ Rebid Request Error:', err);
    res.status(500).json({ message: 'Error requesting rebid', error: err.message });
  }
};

module.exports = { requestRebid };
