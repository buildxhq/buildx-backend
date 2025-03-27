module.exports = function baseLayout(content) {
  return `
    <div style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 30px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 6px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="background: #111827; padding: 20px; color: white; text-align: center;">
          <h1 style="margin: 0; font-size: 20px;">BuildX</h1>
        </div>
        <div style="padding: 20px;">
          ${content}
        </div>
        <div style="background: #f0f0f0; padding: 12px; text-align: center; font-size: 12px; color: #555;">
          This email was sent by BuildX. Questions? Visit <a href="https://www.buildxbid.com" style="color: #333;">our site</a>.
        </div>
      </div>
    </div>
  `;
};

