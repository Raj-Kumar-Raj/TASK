import Joi from "joi";

export const validateResource = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { allowUnknown: true });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        details: error.details[0].message,
      });
    }

    next();
  };
};

export const resourceSchema = Joi.object({
  title: Joi.string().required().max(255),
  description: Joi.string().required(),
  category: Joi.string().required(),
});

export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Admin creation schema
export const adminSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  adminSecret: Joi.string().required(), // Secret for creating admin
});
