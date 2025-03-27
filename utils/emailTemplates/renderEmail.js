const baseLayout = require('./baseLayout');

function renderEmail(type, data) {
  const button = (label, link) => `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${link}" 
         style="background-color: #FFD700; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        ${label}
      </a>
    </div>
  `;

  switch (type) {
    case 'bid_submitted':
      return baseLayout(`
        <h2>New Bid Submitted</h2>
        <p>A subcontractor submitted a bid for <strong>${data.projectName}</strong>.</p>
        <p><strong>Amount:</strong> $${data.amount}</p>
        <p><strong>Notes:</strong> ${data.notes || 'None'}</p>
        ${button('View Project', data.link)}
      `);

    case 'sub_invited':
      return baseLayout(`
        <h2>You're Invited to Bid</h2>
        <p><strong>${data.gcName}</strong> invited you to bid on <strong>${data.projectName}</strong>.</p>
        ${button('🚀 View Project & Submit Bid', data.link)}
      `);

    case 'rebid_requested':
      return baseLayout(`
        <h2>Rebid Requested</h2>
        <p>The GC has requested new bids for <strong>${data.projectName}</strong>.</p>
        ${button('Submit Your Rebid', data.link)}
      `);

    case 'bid_awarded':
      return baseLayout(`
        <h2>🎉 You Got the Job!</h2>
        <p>Your bid was awarded for <strong>${data.projectName}</strong>.</p>
        ${button('View Project', data.link)}
      `);

    case 'ai_result':
      return baseLayout(`
        <h2>✅ AI Takeoff Complete</h2>
        <p>Your AI takeoff for <strong>${data.projectName}</strong> is ready.</p>
        ${button('Download PDF', data.resultUrl)}
      `);

    case 'invite_link':
      return baseLayout(`
       <h2>You're Invited to Bid</h2>
       <p>${data.gcName} invited you to bid on <strong>${data.projectName}</strong>.</p>
       ${button('View Project & Accept Invite', data.signupLink)}
      `);

    default:
      return baseLayout(`<p>Unknown email type</p>`);
  }
}

module.exports = renderEmail;

