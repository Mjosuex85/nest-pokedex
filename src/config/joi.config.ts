import * as Joi from 'joi'

export const JoiValidatorSchema = Joi.object({
    MONGODB: Joi.required(),
    PORT: Joi.required().default(3003),
    DEFAULT_LIMIT: Joi.required().default(6)
});

   

