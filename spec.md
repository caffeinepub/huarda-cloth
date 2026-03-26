# Huarda Cloth

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Public storefront showing clothing products in a grid (name, image, price in BDT)
- Admin panel (login-protected) to add, edit, delete products
- Product image upload via blob storage
- Footer with contact info: MD Maruf, bKash 01325977387, bKash 01764018449
- Bengali language UI

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: Product CRUD (id, name, price, imageId), using blob-storage for product images, authorization for admin access
2. Frontend: 
   - Public page: header, product grid, footer
   - Admin page: login, product list with add/edit/delete, image upload
