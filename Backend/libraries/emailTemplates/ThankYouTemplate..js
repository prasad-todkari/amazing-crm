module.exports = function(name) {
  // return `
  //   <div style="font-family: 'Segoe UI', sans-serif; padding: 30px; background-color: #f0f4f8;">
  //     <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  //       <h2 style="color: #2b7a78;">Thank You, ${name}!</h2>
  //       <p style="font-size: 16px;">We're thrilled that you're happy with our service. Your feedback means the world to us! 😊</p>
  //       <p>Looking forward to serving you again soon.</p>
  //       <p style="margin-top: 30px;">Warm wishes,<br><strong>The Afoozo Team</strong></p>
  //     </div>
  //   </div>
  // `;

  return `<div style="font-family: 'Segoe UI', sans-serif; padding: 30px; background-color: #e2faedff;">
  <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    
    <!-- Mock Logo -->
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://i.ibb.co/QvWYnc4G/output-onlinepngtools.png" alt="Afoozo Logo" style="height: 160px;" />
    </div>

    <!-- Header -->
    <h2 style="color: #2b7a78; text-align: center;">Thank You, ${name}!</h2>
    <p style="font-size: 16px; text-align: center;">We're thrilled that you're happy with our service. <br> Your feedback means the world to us! 😊</p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

    <!-- Body -->
    <p style="font-size: 15px;">Your feedback has been recorded, and we’re excited to continue improving our services to better serve you.</p>
    <p>If you ever have additional thoughts, feel free to reach out to us.</p>

    <!-- Footer -->
    <p style="margin-top: 40px;">Warm regards,<br><strong>The Team Afoozo</strong></p>
  </div>
</div>`
};