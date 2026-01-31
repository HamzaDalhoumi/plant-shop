# Scripts

Medusa CLI scripts for the plant shop.

## Available Scripts

### `seed.ts` - Initial Store Setup

Sets up the store with regions, currencies, shipping, and creates the 4 root categories.

```bash
npx medusa exec ./src/scripts/seed.ts
```

**Run once** when first setting up the application.

---

### `import-plants.ts` - Import Plants from Botanical Databases

Imports plant products from official botanical databases:

1. **Fetches data** from Trefle API + Wikipedia
2. **Gets images** using 3-step AI process:
   - Step 1: Try Unsplash (real photos)
   - Step 2: Generate with DALL-E 3 (if no photo)
   - Step 3: Process with Cloudinary (white background, optimize)
3. **Creates product** in correct category (Indoor/Outdoor Plants)
4. **Status: DRAFT** - hidden until shop owner publishes

```bash
# Import 5 popular plants (default)
npx medusa exec ./src/scripts/import-plants.ts

# Import specific number
npx medusa exec ./src/scripts/import-plants.ts -- --count 10

# Import specific species
npx medusa exec ./src/scripts/import-plants.ts -- --species "Monstera deliciosa"
```

**Required Environment Variables:**

```env
# Botanical data (free)
TREFLE_API_KEY=your_key          # https://trefle.io/

# Images (free tier available)
UNSPLASH_ACCESS_KEY=your_key     # https://unsplash.com/developers
OPENAI_API_KEY=your_key          # https://platform.openai.com/api-keys

# Image processing (free tier available)
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

---

### `taxonomy-data.ts` - Category Definitions

**Not a runnable script** - contains the 4 root category definitions:

- Indoor Plants
- Outdoor Plants  
- Pots
- Accessories

Pots and Accessories are added manually by shop owner in the Admin panel.

---

## Workflow

1. Run `seed.ts` once to set up the store
2. Run `import-plants.ts` to import plants
3. Shop owner publishes products in Admin when available
4. Shop owner adds Pots/Accessories manually in Admin
