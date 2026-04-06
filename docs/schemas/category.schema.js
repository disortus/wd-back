/**
 * @swagger
 * components:
 *   schemas:
 *
 *     CategoryCreate:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *       properties:
 *         name:
 *           type: string
 *           example: Electronics
 *         slug:
 *           type: string
 *           pattern: '^[a-z0-9_]+$'
 *           example: electronics
 *         image:
 *           type: string
 *           example: /imgs/electronics.jpg
 *
 *     CategoryUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         image:
 *           type: string
 *         isActive:
 *           type: boolean
 *
 *     SubcategoryCreate:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *         - categorySlug
 *       properties:
 *         name:
 *           type: string
 *           example: Smartphones
 *         slug:
 *           type: string
 *           pattern: '^[a-z0-9_]+$'
 *           example: smartphones
 *         categorySlug:
 *           type: string
 *           example: electronics
 *
 *     SubcategoryUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         isActive:
 *           type: boolean
 *
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           $ref: '#/components/schemas/Category'
 *
 *     CategoriesListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CategoryWithSubcategories'
 */
