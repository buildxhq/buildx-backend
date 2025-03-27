const project = await prisma.projects.findUnique({ where: { id: project_id } });
const magicLink = `${process.env.FRONTEND_URL}/invite/${token}`;

await sendEmail(email, {
  subject: `📨 You've been invited to bid on ${project.name}`,
  body: `Click this secure link to join BuildX and access the project: ${magicLink}`
});
