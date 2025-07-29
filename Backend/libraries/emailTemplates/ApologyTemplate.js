module.exports = function(name) {
  // return `
  //   <div style="font-family: 'Segoe UI', sans-serif; padding: 30px; background-color: #fff3f3;">
  //     <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  //       <h2 style="color: #d9534f;">We're Sorry, ${name}</h2>
  //       <p style="font-size: 16px;">We sincerely apologize if your experience wasn’t up to expectations. Your feedback helps us improve.</p>
  //       <p>Our team will review your comments and reach out if necessary. We value you and hope to make it right.</p>
  //       <p style="margin-top: 30px;">Sincerely,<br><strong>The Afoozo Team</strong></p>
  //     </div>
  //   </div>
  // `;
  return `
  <div style="font-family: 'Segoe UI', sans-serif; padding: 30px; background-color: #fff3f3;">
  <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    
    <!-- Mock Logo -->
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://i.ibb.co/QvWYnc4G/output-onlinepngtools.png" alt="Afoozo Logo" style="height: 160px;" />
    </div>

    <!-- Header -->
    <h2 style="color: #d9534f; text-align: center;">We’re Sorry, ${name}</h2>
    <p style="font-size: 16px; text-align: center;">We truly regret that your experience did not meet expectations. 😞</p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

    <!-- Body -->
    <p style="font-size: 15px;">We appreciate your honest feedback, and we’re reviewing your comments to understand what went wrong.</p>
    <p>Our goal is to do better, and we hope to have the opportunity to improve your experience in the future.</p>

    <!-- Footer -->
    <p style="margin-top: 40px;">Sincerely,<br><strong>The Team Afoozo</strong></p>
  </div>
</div>`
};
