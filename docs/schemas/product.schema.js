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
 *           example: Premium Apple smartphone with A17 Pro chip
 *
 *         price:
 *           type: number
 *           example: 999990
 *
 *         stock:
 *           type: number
 *           example: 50
 *
 *         categorySlug:
 *           type: string
 *           example: electronics
 *
 *         subcategorySlug:
 *           type: string
 *           example: smartphones
 *
 *         attributes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *                 example: color
 *               label:
 *                 type: string
 *                 example: Color
 *               value:
 *                 type: mixed
 *                 example: Space Gray
 *               unit:
 *                 type: string
 *                 example: null
 *
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["/imgs/123456789-test-image.jpg"]
 *
 *         mainImage:
 *           type: string
 *           example: "/imgs/123456789-test-image.jpg"
 *
 *         isActive:
 *           type: boolean
 *           example: true
 *
 *         category_id:
 *           type: string
 *           example: 67f1c9a812e4ab1234567891
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ProductCreate:
 *       type: object
 *       required:
 *         - title
 *         - categorySlug
 *         - subcategorySlug
 *         - price
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           example: iPhone 15 Pro
 *         categorySlug:
 *           type: string
 *           enum: [electronics, audio_wearables, accessories, desktops_monitors, tv_home]
 *           example: electronics
 *         subcategorySlug:
 *           type: string
 *           enum: [smartphones, laptops, tablets, smart_watches, headphones, speakers, desktops, monitors, chargers, cables, cases, adapters, keyboards, mice, apple_pencil, hubs_docks, streaming_devices, smart_home]
 *           example: smartphones
 *         price:
 *           type: number
 *           minimum: 0
 *           example: 499990
 *         stock:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *           example: 10
 *         description:
 *           type: string
 *           example: iPhone 15 Pro description
 *         attributes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *               label:
 *                 type: string
 *               value:
 *                 type: mixed
 *               unit:
 *                 type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         mainImage:
 *           type: string
 *
 *     ProductUpdate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *         categorySlug:
 *           type: string
 *         subcategorySlug:
 *           type: string
 *         price:
 *           type: number
 *           minimum: 0
 *         stock:
 *           type: integer
 *           minimum: 0
 *         description:
 *           type: string
 *         attributes:
 *           type: array
 *           items:
 *             type: object
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         mainImage:
 *           type: string
 *         isActive:
 *           type: boolean
 *
 *     ProductImageUpload:
 *       type: object
 *       consumes:
 *         - multipart/form-data
 *       properties:
 *         images:
 *           type: array
 *           items:
 *             type: file
 *           description: Image files (max 10, max 10MB each)
 *
 *     ProductListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *
 *     ProductResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           $ref: '#/components/schemas/Product'
 *         message:
 *           type: string
 */
