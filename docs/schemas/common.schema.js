/**
 * @swagger
 * components:
 *   schemas:
 *
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error message
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 *
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         total:
 *           type: integer
 *         pages:
 *           type: integer
 *
 *     Address:
 *       type: object
 *       properties:
 *         label:
 *           type: string
 *           example: Home
 *         isDefault:
 *           type: boolean
 *           example: true
 *         recipientName:
 *           type: string
 *           example: John Doe
 *         phone:
 *           type: string
 *           example: +77001234567
 *         street:
 *           type: string
 *           example: 123 Main St
 *         city:
 *           type: string
 *           example: Almaty
 *         postalCode:
 *           type: string
 *           example: 050000
 *         country:
 *           type: string
 *           example: Kazakhstan
 *         instructions:
 *           type: string
 *           example: Call upon arrival
 *
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           example: Electronics
 *         slug:
 *           type: string
 *           example: electronics
 *         image:
 *           type: string
 *         isActive:
 *           type: boolean
 *           example: true
 *
 *     Subcategory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           example: Smartphones
 *         slug:
 *           type: string
 *           example: smartphones
 *         categorySlug:
 *           type: string
 *           example: electronics
 *         isActive:
 *           type: boolean
 *           example: true
 *
 *     CategoryWithSubcategories:
 *       allOf:
 *         - $ref: '#/components/schemas/Category'
 *         - type: object
 *           properties:
 *             subcategories:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subcategory'
 *
 *     CatalogResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CategoryWithSubcategories'
 *
 *     HealthCheck:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: OK
 *         timestamp:
 *           type: string
 *           format: date-time
 *         uptime:
 *           type: number
 *         database:
 *           type: string
 *           example: connected
 */
