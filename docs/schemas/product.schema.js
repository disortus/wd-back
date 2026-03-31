/**
 * @swagger
 * components:
 *   schemas:
 *
 *     Product:
 *       type: object
 *       properties:
 *
 *         _id:
 *           type: string
 *           example: 67f1c9a812e4ab1234567890
 *
 *         title:
 *           type: string
 *           example: iPhone 15 Pro Max 256GB
 *
 *         slug:
 *           type: string
 *           example: iphone-15-pro-max-256gb
 *
 *         description:
 *           type: string
 *           example: Premium Apple smartphone
 *
 *         price:
 *           type: number
 *           example: 999999
 *
 *         stock:
 *           type: number
 *           example: 12
 *
 *         images:
 *           type: array
 *           items:
 *             type: string
 *
 *         category:
 *           $ref: '#/components/schemas/Category'
 *
 *         isActive:
 *           type: boolean
 *           example: true
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *
 *     ProductListResponse:
 *       type: object
 *       properties:
 *
 *         success:
 *           type: boolean
 *
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *
 *         meta:
 *           $ref: '#/components/schemas/PaginationMeta'
 */