const prisma = require('../utils/prismaClient');
const sendEmail = require('../utils/sendEmail');
const logActivity = require('../utils/logActivity');
const csvParser = require('csv-parser');
const crypto = require('crypto');

// ✅ POST /api/bids
const createBidHandler = async (req, res) => {
  try {
    const { projectId, amount, notes } = req.body;
    if (!projectId || !amount) {
      return res.status(400).json({ message: "Project ID and bid amount are required" });
    }

    const bid = await prisma.bids.create({
      data: {
        project_id: projectId,
        user_id: req.user.id,
        amount,
        notes
      },
      include: {
        project: { include: { owner: true } }
      }
    });

    // ✅ Notify GC via email + log
    if (bid.project?.owner?.email) {
      await sendEmail(bid.project.owner.email, {
        subject: `📥 New Bid Submitted for ${bid.project.name}`,
        type: 'bid_submitted',
        data: {
          projectName: bid.project.name,
          amount: bid.amount,
          notes: bid.notes,
          link: `${process.env.FRONTEND_URL}/projects/${projectId}`
        }
      });

      await prisma.notifications.create({
        data: {
          user_id: bid.project.owner_id,
          message: `📥 New bid submitted for "${bid.project.name}"`,
          link: `/projects/${projectId}`
        }
      });
    }

    await logActivity(req.user.id, 'Submitted Bid', `Bid $${bid.amount} on "${bid.project.name}"`);
    res.json({ message: "Bid submitted", bid });

  } catch (error) {
    console.error("❌ Bid Submission Error:", error);
    res.status(500).json({ message: "Error placing bid", error: error.message });
  }
};

// ✅ GET /api/bids/:projectId
const getBidsForProjectHandler = async (req, res) => {
  try {
    const bids = await prisma.bids.findMany({
      where: { project_id: parseInt(req.params.projectId) },
      include: {
        user: { select: { id: true, email: true, name: true } }
      }
    });
    res.json(bids);
  } catch (error) {
    console.error("❌ Get Bids Error:", error);
    res.status(500).json({ message: "Error retrieving bids", error: error.message });
  }
};

// ✅ GET /api/bids/user/:userId
const getBidsForUserHandler = async (req, res) => {
  try {
    const bids = await prisma.bids.findMany({
      where: { user_id: parseInt(req.params.userId) },
      include: { project: true }
    });
    res.json(bids);
  } catch (error) {
    console.error("❌ Get Bids for User Error:", error);
    res.status(500).json({ message: "Error retrieving bids", error: error.message });
  }
};

// ✅ PATCH /api/bids/:id/award
const awardBidHandler = async (req, res) => {
  try {
    const bidId = parseInt(req.params.id);

    const updatedBid = await prisma.bids.update({
      where: { id: bidId },
      data: {
        status: "awarded",
        awardedAt: new Date()
      }
    });

    await prisma.notifications.create({
      data: {
        user_id: updatedBid.user_id,
        message: `🏆 Your bid was awarded for Project #${updatedBid.project_id}`,
        link: `/projects/${updatedBid.project_id}`
      }
    });

    await logActivity(updatedBid.user_id, 'Bid Awarded', `For Project #${updatedBid.project_id}`);
    res.json({ message: "Bid awarded successfully", bid: updatedBid });
  } catch (error) {
    console.error("❌ Award Bid Error:", error);
    res.status(500).json({ message: "Error awarding bid", error: error.message });
  }
};

// ✅ POST /api/bids/invite
const inviteSubcontractor = async (req, res) => {
  try {
    const { projectId, subcontractorEmail, name, phone } = req.body;

    if (!projectId || !subcontractorEmail) {
      return res.status(400).json({ message: "Project ID and subcontractor email are required" });
    }

    if (!['gc', 'ae'].includes(req.user.role)) {
      return res.status(403).json({ message: "Only GCs and AEs can send invites." });
    }

    const project = await prisma.projects.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ message: "Project not found" });

    // 🔑 Generate token
    const token = crypto.randomBytes(20).toString('hex');

    // 💾 Save invite in DB
    const invite = await prisma.invites.create({
      data: {
        project_id: projectId,
        invited_by: req.user.id,
        email: subcontractorEmail,
        token,
        name: name || null,
        phone: phone || null,
        status: 'pending'
      }
    });

    // 📬 In-app notification (if user exists)
    const invitedUser = await prisma.users.findUnique({ where: { email: subcontractorEmail } });
    if (invitedUser) {
      await prisma.notifications.create({
        data: {
          user_id: invitedUser.id,
          message: `📬 You've been invited to bid on "${project.name}"`,
          link: `/projects/${projectId}`
        }
      });
    }

    // 📧 Send email with invite token signup link
    await sendEmail(subcontractorEmail, {
      subject: `📬 You're Invited to Bid on "${project.name}"`,
      type: 'sub_invited',
      data: {
        projectName: project.name,
        gcName: req.user.name || 'BuildX GC',
        deadline: new Date(project.deadline).toDateString(),
        description: project.description,
        link: `${process.env.FRONTEND_URL}/signup?invite=${token}`
      }
    });

    // 📜 Log activity
    await logActivity(req.user.id, 'Invited Subcontractor', `Invited ${subcontractorEmail} to "${project.name}"`);

    res.json({ message: `Invite sent to ${subcontractorEmail}`, invite });

  } catch (error) {
    console.error('❌ Subcontractor Invite Error:', error);
    res.status(500).json({ message: 'Failed to send invite', error: error.message });
  }
};

// ✅ POST /api/bids/:projectId/rebid
const requestRebid = async (req, res) => {
  const { projectId } = req.params;

  try {
    const bids = await prisma.bids.findMany({
      where: { project_id: parseInt(projectId) },
      include: { user: true, project: true }
    });

    for (const bid of bids) {
      await sendEmail(bid.user.email, {
        subject: `🔁 Rebid Requested for "${bid.project.name}"`,
        type: 'rebid_requested',
        data: {
          projectName: bid.project.name,
          link: `${process.env.FRONTEND_URL}/projects/${bid.project_id}`
        }
      });

      await prisma.notifications.create({
        data: {
          user_id: bid.user_id,
          message: `🔁 Rebid requested for "${bid.project.name}"`,
          link: `/projects/${bid.project_id}`
        }
      });
    }

    res.json({ message: 'Rebid request sent to all subcontractors.' });
  } catch (error) {
    console.error('❌ Rebid Request Error:', error);
    res.status(500).json({ message: 'Failed to send rebid request', error: error.message });
  }
};

const uploadSubcontractors = async (req, res) => {
  try {
    const results = [];
    const { projectId } = req.body;

    const project = await prisma.projects.findUnique({ where: { id: parseInt(projectId) } });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const lines = req.file.buffer.toString().split('\n');
    for (const line of lines) {
      const [name, email, phone] = line.split(',');

      if (!email) continue;

      const token = crypto.randomBytes(20).toString('hex');

      const invite = await prisma.invites.create({
        data: {
          email: email.trim(),
          name: name?.trim() || null,
          phone: phone?.trim() || null,
          token,
          project_id: parseInt(projectId),
          invited_by: req.user.id,
        }
      });

      await sendEmail(email, {
        subject: `🚀 You're Invited to Bid on ${project.name}`,
        type: 'sub_invited',
        data: {
          gcName: req.user.name || 'BuildX GC',
          projectName: project.name,
          link: `${process.env.FRONTEND_URL}/signup?invite=${token}`
        }
      });

      results.push(invite);
    }

    res.json({ message: 'Invites sent successfully', results });
  } catch (error) {
    console.error('❌ Upload Subs Error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

module.exports = {
  createBidHandler,
  getBidsForProjectHandler,
  getBidsForUserHandler,
  awardBidHandler,
  inviteSubcontractor,
  requestRebid,
  uploadSubcontractors
};

