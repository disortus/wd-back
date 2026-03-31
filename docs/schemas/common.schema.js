/**
 * @swagger
 * components:
 *   schemas:
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *     MessageResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: operation completed
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: validation failed
 *
 *     ValidationErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: validation failed
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: email
 *               message:
 *                 type: string
 *                 example: invalid email
 *
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         total:
 *           type: number
 *           example: 100
 *         page:
 *           type: number
 *           example: 1
 *         pages:
 *           type: number
 *           example: 10
 */