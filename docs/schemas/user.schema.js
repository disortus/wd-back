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
 *         fullname:
 *           type: string
 *           example: John Doe
 *         phone:
 *           type: string
 *           example: +77001234567
 *         role:
 *           type: string
 *           enum: [user, admin, moderator, courier, support]
 *           example: user
 *         isActive:
 *           type: boolean
 *           example: true
 *         profile:
 *           type: object
 *           properties:
 *             avatar:
 *               type: string
 *             dateOfBirth:
 *               type: string
 *               format: date
 *             gender:
 *               type: string
 *               enum: [male, female, other]
 *             bio:
 *               type: string
 *         addresses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Address'
 *         notifications:
 *           type: object
 *           properties:
 *             email:
 *               type: object
 *               properties:
 *                 orderUpdates:
 *                   type: boolean
 *                 promotions:
 *                   type: boolean
 *                 supportUpdates:
 *                   type: boolean
 *             sms:
 *               type: object
 *               properties:
 *                 orderUpdates:
 *                   type: boolean
 *                 promotions:
 *                   type: boolean
 *         stats:
 *           type: object
 *           properties:
 *             totalOrders:
 *               type: integer
 *             totalSpent:
 *               type: number
 *             activeOrders:
 *               type: integer
 *             openTickets:
 *               type: integer
 *         staffInfo:
 *           type: object
 *           properties:
 *             hireDate:
 *               type: string
 *               format: date
 *             department:
 *               type: string
 *             position:
 *               type: string
 *         lastLogin:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     UserCreate:
 *       type: object
 *       required:
 *         - fullname
 *         - phone
 *         - password
 *         - role
 *       properties:
 *         fullname:
 *           type: string
 *           minLength: 2
 *           example: John Doe
 *         phone:
 *           type: string
 *           pattern: '^\+?[1-9]\d{1,14}$'
 *           example: +77001234567
 *         password:
 *           type: string
 *           minLength: 6
 *           example: password123
 *         role:
 *           type: string
 *           enum: [user, admin, moderator, courier, support]
 *           example: moderator
 *
 *     UserUpdate:
 *       type: object
 *       properties:
 *         fullname:
 *           type: string
 *           minLength: 2
 *         phone:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin, moderator, courier, support]
 *         isActive:
 *           type: boolean
 *         staffInfo:
 *           type: object
 *
 *     UserListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         pagination:
 *           $ref: '#/components/schemas/PaginationMeta'
 *
 *     UserResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           $ref: '#/components/schemas/User'
 */
