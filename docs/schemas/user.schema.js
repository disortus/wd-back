/**
 * @swagger
 * components:
 *   schemas:
 *
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 67f1c9a812e4ab1234567890
 *
 *         fullName:
 *           type: string
 *           example: Ivan Ivanov
 *
 *         email:
 *           type: string
 *           example: test@mail.com
 *
 *         phone:
 *           type: string
 *           example: +77001234567
 *
 *         role:
 *           type: string
 *           enum:
 *             - user
 *             - admin
 *             - courier
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 */