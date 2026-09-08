// Generic Validation Middleware

export const validate = (validatorFn) => {
  return (req, res, next) => {
    return validatorFn(req, res, next);
  };
};

export default {
  validate,
};
