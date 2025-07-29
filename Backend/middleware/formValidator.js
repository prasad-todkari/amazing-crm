const allowedOrigins = ['https://crm.afoozo.com', 'http://localhost:3000'];

const requestValidator = (req, res, next) => {
  const origin = req.headers.origin;
  console.log(origin);
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).send('Unauthorized Access');
  }
  next();
};

module.exports = requestValidator;