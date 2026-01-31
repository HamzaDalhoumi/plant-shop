# Medusa v2 Framework Rules

> Ce document contient les règles et conventions du framework Medusa v2.
> À utiliser comme contexte pour les assistants IA (Copilot, Cursor, Claude, etc.)

---

## 🏗️ Architecture Fondamentale

Medusa v2 est basé sur une **architecture modulaire** avec ces concepts clés:

| Concept | Description | Répertoire |
|---------|-------------|------------|
| **Modules** | Packages isolés pour une fonctionnalité/domaine | `src/modules/` |
| **Workflows** | Orchestration d'opérations avec rollback automatique | `src/workflows/` |
| **API Routes** | Endpoints REST pour clients externes | `src/api/` |
| **Subscribers** | Gestionnaires d'événements asynchrones | `src/subscribers/` |
| **Scheduled Jobs** | Tâches planifiées (cron) | `src/jobs/` |
| **Links** | Relations entre modules isolés | `src/links/` |

---

## 📁 Structure des Répertoires

```
src/
├── modules/                    # Modules personnalisés
│   └── [module-name]/
│       ├── index.ts            # Définition du module (OBLIGATOIRE)
│       ├── service.ts          # Service principal (OBLIGATOIRE)
│       ├── models/             # Data models
│       │   └── [model].ts
│       ├── migrations/         # Migrations générées
│       └── loaders/            # Loaders optionnels
│
├── workflows/                  # Workflows
│   └── [workflow-name].ts
│
├── api/                        # Routes API
│   ├── store/                  # Routes storefront (publiques)
│   │   └── custom/
│   │       └── route.ts
│   ├── admin/                  # Routes admin (protégées)
│   │   └── custom/
│   │       └── route.ts
│   └── middlewares.ts          # Middlewares globaux
│
├── subscribers/                # Event subscribers
│   └── [event-name].ts
│
├── jobs/                       # Scheduled jobs
│   └── [job-name].ts
│
├── links/                      # Module links
│   └── [link-name].ts
│
└── scripts/                    # Scripts CLI custom
    └── [script-name].ts
```

---

## 📦 Modules

### Structure d'un Module

```typescript
// src/modules/blog/models/post.ts
import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {  // Nom table en snake_case
  id: model.id().primaryKey(),
  title: model.text(),
  content: model.text().nullable(),
  // created_at, updated_at, deleted_at sont automatiques
})

export default Post
```

```typescript
// src/modules/blog/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import Post from "./models/post"

class BlogModuleService extends MedusaService({
  Post,  // Génère: createPosts, retrievePost, updatePosts, deletePosts, etc.
}) {
  // Méthodes personnalisées ici
}

export default BlogModuleService
```

```typescript
// src/modules/blog/index.ts
import BlogModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const BLOG_MODULE = "blog"  // Nom du module (alphanumeric + underscore)

export default Module(BLOG_MODULE, {
  service: BlogModuleService,
})
```

### Règles des Modules

| ✅ À FAIRE | ❌ À NE PAS FAIRE |
|-----------|-------------------|
| Nom du module en snake_case (`plant_info`) | Tirets dans le nom (`plant-info`) |
| Étendre `MedusaService({Model})` | Créer CRUD manuellement |
| Exporter constante du nom (`BLOG_MODULE`) | Utiliser string littéral partout |
| `super(...arguments)` si constructor | Oublier d'appeler super |

### Méthodes Générées par MedusaService

Pour un modèle `Post`, ces méthodes sont générées:
- `listPosts(filters?, config?)` - Liste avec filtres
- `listAndCountPosts(filters?, config?)` - Liste + count
- `retrievePost(id, config?)` - Un seul par ID
- `createPosts(data)` - Créer un ou plusieurs
- `updatePosts(data)` - Mettre à jour
- `deletePosts(ids)` - Supprimer
- `softDeletePosts(ids)` - Soft delete
- `restorePosts(ids)` - Restaurer

---

## ⚡ Workflows

### Structure d'un Workflow

```typescript
// src/workflows/create-post.ts
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { BLOG_MODULE } from "../modules/blog"
import BlogModuleService from "../modules/blog/service"

// 1. Définir le Step
const createPostStep = createStep(
  "create-post-step",  // Nom unique du step
  async (input: { title: string }, { container }) => {
    // Résoudre le service depuis le container
    const blogService: BlogModuleService = container.resolve(BLOG_MODULE)
    
    const post = await blogService.createPosts({ title: input.title })
    
    // OBLIGATOIRE: Retourner StepResponse(data, compensationData)
    return new StepResponse(post, post.id)
  },
  // Fonction de compensation (rollback)
  async (postId, { container }) => {
    if (!postId) return
    
    const blogService: BlogModuleService = container.resolve(BLOG_MODULE)
    await blogService.deletePosts(postId)
  }
)

// 2. Définir le Workflow
export const createPostWorkflow = createWorkflow(
  "create-post",  // Nom unique du workflow
  (input: { title: string }) => {
    const post = createPostStep(input)
    
    // OBLIGATOIRE: Retourner WorkflowResponse
    return new WorkflowResponse({ post })
  }
)
```

### Règles des Workflows

| ✅ À FAIRE | ❌ À NE PAS FAIRE |
|-----------|-------------------|
| Retourner `StepResponse` dans les steps | Retourner une valeur simple |
| Retourner `WorkflowResponse` dans le workflow | Retourner un objet simple |
| Définir une fonction de compensation | Ignorer le rollback |
| Utiliser `container.resolve()` pour les services | Importer directement les services |

### Exécuter un Workflow

```typescript
// Dans une API route
const { result } = await createPostWorkflow(req.scope).run({
  input: { title: "Mon Post" }
})

// Dans un subscriber
const { result } = await createPostWorkflow(container).run({
  input: { title: "Mon Post" }
})

// Dans un scheduled job
const { result } = await createPostWorkflow(container).run({
  input: { title: "Mon Post" }
})
```

---

## 🌐 API Routes

### Structure d'une Route

```typescript
// src/api/store/custom/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createPostWorkflow } from "../../../workflows/create-post"

// GET /store/custom
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")
  
  const { data: posts } = await query.graph({
    entity: "post",
    fields: ["*"],
  })
  
  res.json({ posts })
}

// POST /store/custom
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result } = await createPostWorkflow(req.scope).run({
    input: req.body,
  })
  
  res.json({ post: result.post })
}
```

### Routes avec Paramètres

```typescript
// src/api/store/posts/[id]/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET /store/posts/:id
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  
  const blogService = req.scope.resolve("blog")
  const post = await blogService.retrievePost(id)
  
  res.json({ post })
}
```

### Règles des API Routes

| ✅ À FAIRE | ❌ À NE PAS FAIRE |
|-----------|-------------------|
| Fichier nommé `route.ts` | Autre nom de fichier |
| Exporter `GET`, `POST`, `PUT`, `DELETE` | Exporter `default` |
| Utiliser `req.scope` pour le container | Utiliser un container global |
| Dossier `[param]` pour paramètres dynamiques | Query strings pour IDs |

---

## 📬 Subscribers (Event Handlers)

### Structure d'un Subscriber

```typescript
// src/subscribers/order-placed.ts
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendOrderConfirmationWorkflow } from "../workflows/send-order-confirmation"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")
  
  logger.info(`Order placed: ${data.id}`)
  
  await sendOrderConfirmationWorkflow(container).run({
    input: { orderId: data.id },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",  // ou ["event1", "event2"] pour plusieurs
}
```

### Événements Courants

- `order.placed` - Commande passée
- `product.created` - Produit créé
- `product.updated` - Produit mis à jour
- `customer.created` - Client créé
- `cart.updated` - Panier mis à jour

---

## ⏰ Scheduled Jobs

### Structure d'un Job

```typescript
// src/jobs/sync-products.ts
import { MedusaContainer } from "@medusajs/framework/types"
import { syncProductsWorkflow } from "../workflows/sync-products"

export default async function syncProductsJob(container: MedusaContainer) {
  const logger = container.resolve("logger")
  
  logger.info("Starting product sync...")
  
  await syncProductsWorkflow(container).run()
  
  logger.info("Product sync completed")
}

export const config = {
  name: "sync-products-daily",     // Nom unique
  schedule: "0 0 * * *",           // Cron: minuit chaque jour
}
```

### Expressions Cron Courantes

| Expression | Description |
|------------|-------------|
| `* * * * *` | Chaque minute |
| `0 * * * *` | Chaque heure |
| `0 0 * * *` | Chaque jour à minuit |
| `0 0 * * 0` | Chaque dimanche |
| `0 0 1 * *` | Premier jour du mois |

---

## 🔗 Module Links

### Définir un Link

```typescript
// src/links/product-brand.ts
import BrandModule from "../modules/brand"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  ProductModule.linkable.product,
  BrandModule.linkable.brand
)
```

### Link One-to-Many

```typescript
export default defineLink(
  ProductModule.linkable.product,
  {
    linkable: BrandModule.linkable.brand,
    isList: true,  // Un product peut avoir plusieurs brands
  }
)
```

### Après création d'un Link

```bash
npx medusa db:sync-links   # Synchroniser les tables de liens
# ou
npx medusa db:migrate      # Fait les migrations + sync links
```

---

## 🗃️ Data Models (DML)

### Types de Propriétés

```typescript
import { model } from "@medusajs/framework/utils"

const Product = model.define("product", {
  // Identifiants
  id: model.id().primaryKey(),
  
  // Texte
  title: model.text(),
  description: model.text().nullable(),
  
  // Nombres
  price: model.bigNumber(),
  quantity: model.number().default(0),
  
  // Booléen
  is_active: model.boolean().default(true),
  
  // Date
  published_at: model.dateTime().nullable(),
  
  // Enum
  status: model.enum(["draft", "published", "archived"]),
  
  // JSON
  metadata: model.json().nullable(),
  
  // Relations (même module uniquement)
  category: model.belongsTo(() => Category),
  variants: model.hasMany(() => Variant),
})
```

### Règles des Data Models

| ✅ À FAIRE | ❌ À NE PAS FAIRE |
|-----------|-------------------|
| Nom de table en snake_case | camelCase ou PascalCase |
| Relations dans le même module | Relations cross-module (utiliser Links) |
| Générer migrations après changement | Modifier la DB manuellement |

---

## 📥 Imports Corrects

```typescript
// Framework utilities
import { MedusaService, Module, defineLink, model } from "@medusajs/framework/utils"

// Workflows SDK
import { 
  createStep, 
  createWorkflow, 
  StepResponse, 
  WorkflowResponse,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"

// HTTP types
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// Types
import type { MedusaContainer } from "@medusajs/framework/types"
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

// Container keys
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

// Core flows (workflows existants)
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"

// Modules commerce
import ProductModule from "@medusajs/medusa/product"
import RegionModule from "@medusajs/medusa/region"
```

---

## 🔧 Medusa Container

### Résoudre des Services

```typescript
// Dans un step de workflow
async (input, { container }) => {
  // Module personnalisé
  const blogService = container.resolve("blog")
  
  // Modules commerce
  const productService = container.resolve("product")
  const regionService = container.resolve("region")
  
  // Utilities
  const query = container.resolve("query")
  const logger = container.resolve("logger")
  const link = container.resolve("link")
}

// Dans une API route
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const productService = req.scope.resolve("product")
}
```

### Clés de Registration Courantes

| Clé | Service |
|-----|---------|
| `"query"` | Query pour récupérer des données |
| `"logger"` | Logger (Winston) |
| `"link"` | Gestionnaire de links |
| `"product"` | Product Module Service |
| `"region"` | Region Module Service |
| `"customer"` | Customer Module Service |
| `"order"` | Order Module Service |
| `"cart"` | Cart Module Service |
| `"pricing"` | Pricing Module Service |

---

## 🔍 Query (Récupération de Données)

```typescript
const query = container.resolve("query")

// Récupérer des produits
const { data: products } = await query.graph({
  entity: "product",
  fields: ["id", "title", "variants.*", "categories.*"],
  filters: {
    id: ["prod_123", "prod_456"],
  },
})

// Avec pagination
const { data: products, metadata } = await query.graph({
  entity: "product",
  fields: ["*"],
  pagination: {
    skip: 0,
    take: 10,
  },
})
```

---

## 🚨 Erreurs Courantes à Éviter

### 1. Oublier StepResponse dans les Steps

```typescript
// ❌ FAUX
const myStep = createStep("my-step", async (input) => {
  return { data: "value" }  // Erreur!
})

// ✅ CORRECT
const myStep = createStep("my-step", async (input) => {
  return new StepResponse({ data: "value" })
})
```

### 2. Oublier WorkflowResponse dans les Workflows

```typescript
// ❌ FAUX
const myWorkflow = createWorkflow("my-workflow", (input) => {
  const result = myStep(input)
  return result  // Erreur!
})

// ✅ CORRECT
const myWorkflow = createWorkflow("my-workflow", (input) => {
  const result = myStep(input)
  return new WorkflowResponse(result)
})
```

### 3. Relations Cross-Module sans Link

```typescript
// ❌ FAUX - Relation directe entre modules
const Brand = model.define("brand", {
  products: model.hasMany(() => Product),  // Product est d'un autre module!
})

// ✅ CORRECT - Utiliser defineLink
// src/links/brand-product.ts
export default defineLink(
  ProductModule.linkable.product,
  BrandModule.linkable.brand
)
```

### 4. Oublier les Migrations

```bash
# Après modification d'un data model:
npx medusa db:generate [module_name]
npx medusa db:migrate
```

### 5. Mauvais Nom de Fichier pour Routes

```
# ❌ FAUX
src/api/store/products/index.ts
src/api/store/products/handler.ts

# ✅ CORRECT
src/api/store/products/route.ts
```

---

## 📋 Commandes CLI Essentielles

```bash
# Développement
npx medusa dev                    # Démarrer en mode dev

# Base de données
npx medusa db:create              # Créer la DB
npx medusa db:generate [module]   # Générer migrations
npx medusa db:migrate             # Exécuter migrations
npx medusa db:sync-links          # Synchroniser les links

# Scripts
npx medusa exec ./src/scripts/seed.ts   # Exécuter un script

# Utilisateurs
npx medusa user -e email -p password    # Créer un admin
```

---

## 🎯 Checklist Avant Commit

- [ ] Toutes les steps retournent `StepResponse`
- [ ] Tous les workflows retournent `WorkflowResponse`
- [ ] Les migrations sont générées et exécutées
- [ ] Les noms de modules sont en snake_case
- [ ] Les fichiers de routes sont nommés `route.ts`
- [ ] Les services étendent `MedusaService`
- [ ] Les compensations (rollback) sont définies pour les steps critiques

---

## 📚 Ressources

- [Documentation officielle](https://docs.medusajs.com/learn)
- [API Reference](https://docs.medusajs.com/api)
- [Service Factory Reference](https://docs.medusajs.com/resources/service-factory-reference)
- [Events Reference](https://docs.medusajs.com/resources/references/events)
- [Medusa Container Resources](https://docs.medusajs.com/resources/medusa-container-resources)
