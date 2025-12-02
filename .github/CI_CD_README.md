# CI/CD Configuration

Este proyecto está configurado con GitHub Actions para CI/CD automático.

## 📋 Workflows Configurados

### 1. **CI Pipeline** (`.github/workflows/ci.yml`)
Se ejecuta en cada push y pull request a las ramas `develop` y `main`.

**Incluye:**
- ✅ ESLint
- ✅ TypeScript Type Check
- ✅ Build de Next.js
- ✅ Subida de artefactos de build (guardados por 7 días para debugging)

### 2. **Deploy to Production** (`.github/workflows/deploy.yml`)
Se ejecuta automáticamente al hacer push a la rama `main`.

**Características:**
- 🚀 Deploy automático a Vercel (producción)
- 📊 Resumen de deployment en GitHub
- 🔗 URL de producción en el output

### 3. **Preview Deployment** (`.github/workflows/preview.yml`)
Se ejecuta automáticamente en cada Pull Request.

**Características:**
- 👀 Deploy de preview a Vercel
- 💬 Comentario automático en el PR con la URL de preview
- 🔄 Se actualiza con cada nuevo commit al PR
- 🔐 Permisos: `pull-requests: write` para poder comentar

### 4. **Semantic Release** (`.github/workflows/release.yml`)
Se ejecuta automáticamente al hacer push a `main` (después del merge).

**Características:**
- 🏷️ Versionado automático basado en Conventional Commits
- 📝 Generación automática de CHANGELOG.md
- 🎯 Creación de tags de Git (v1.0.0, v1.1.0, etc.)
- 📦 Creación de GitHub Releases con notas
- 🔄 Commit automático de cambios (`[skip ci]` para evitar loops)

**Reglas de versionado:**
- `feat:` → Minor version (1.X.0)
- `fix:` → Patch version (1.0.X)
- `feat!:` o `BREAKING CHANGE:` → Major version (X.0.0)

### 5. **Sync Develop** (`.github/workflows/sync-develop.yml`)
Se ejecuta después de un release exitoso.

**Características:**
- 🔄 Sincroniza automáticamente `develop` con `main`
- 📥 Trae los cambios del CHANGELOG y package.json actualizados
- 🤖 Solo corre cuando hay un commit de release

## 🔧 Configuración Requerida

Para que los workflows de deployment funcionen, necesitas configurar los siguientes **GitHub Secrets**:

### Paso 1: Obtener credenciales de Vercel

1. Ve a [Vercel](https://vercel.com) y accede a tu cuenta
2. Ve a **Settings** → **Tokens** y crea un nuevo token
3. Guarda el token generado

### Paso 2: Obtener IDs del proyecto

Ejecuta estos comandos en tu terminal local:

```bash
# Instala Vercel CLI si no lo tienes
npm install -g vercel

# Vincula tu proyecto
vercel link

# Los IDs se guardarán en .vercel/project.json
```

O alternativamente, ve a tu proyecto en Vercel → Settings → General para obtener:
- **Project ID**
- **Team/Org ID** (en la URL o en settings)

### Paso 3: Agregar secrets a GitHub

Ve a tu repositorio en GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Agrega estos 3 secrets:

| Secret Name | Descripción | Dónde obtenerlo |
|------------|-------------|-----------------|
| `VERCEL_TOKEN` | Token de acceso de Vercel | Vercel → Settings → Tokens |
| `VERCEL_ORG_ID` | ID de tu organización/equipo | `.vercel/project.json` o Vercel Settings |
| `VERCEL_PROJECT_ID` | ID del proyecto | `.vercel/project.json` o Vercel Settings |

### Paso 4: Configurar Environments (Opcional pero recomendado)

En GitHub → Settings → Environments, crea:
- `production` (para deploys a main)
- `preview` (para deploys de PRs)

Puedes agregar protecciones adicionales como required reviewers.

## 🚀 Uso

### Flujo de Desarrollo Completo

```
1. Crear rama feature
   git checkout -b feature/nueva-funcionalidad

2. Desarrollar y hacer commits (¡usa Conventional Commits!)
   git commit -m "feat: add new search filter"
   git commit -m "fix: resolve mobile layout issue"

3. Push y abrir PR hacia develop
   git push origin feature/nueva-funcionalidad
   → Preview deployment se crea automáticamente
   → CI checks corren

4. Merge a develop
   → Todos los checks deben pasar ✅

5. Cuando estés listo para release, PR de develop → main
   
6. Merge a main
   → CI corre
   → Deploy a producción
   → Semantic Release crea versión
   → develop se sincroniza automáticamente
```

### Conventional Commits (Importante para Releases)

Para que el versionado automático funcione, **debes usar Conventional Commits**:

```bash
# Features (incrementa versión MINOR)
git commit -m "feat: add user authentication"
git commit -m "feat(search): implement fuzzy matching"

# Fixes (incrementa versión PATCH)
git commit -m "fix: resolve memory leak"
git commit -m "fix(ui): correct button alignment"

# Breaking changes (incrementa versión MAJOR)
git commit -m "feat!: change API response format"
git commit -m "feat: new endpoint

BREAKING CHANGE: old endpoint /api/v1 removed"

# Otros tipos (no crean release)
git commit -m "docs: update README"
git commit -m "style: format code"
git commit -m "refactor: simplify search logic"
git commit -m "test: add unit tests"
git commit -m "chore: update dependencies"
```

Ver guía completa: [CONVENTIONAL_COMMITS.md](./CONVENTIONAL_COMMITS.md)

### Deploy a Producción
```bash
# Opción A: Desde la UI de GitHub
1. Crea PR de develop → main
2. Review y merge
3. Automático: CI + Deploy + Release

# Opción B: Desde terminal (fast-forward)
git checkout main
git merge develop --ff-only
git push origin main
```

Esto automáticamente:
1. Ejecutará el pipeline de CI
2. Desplegará a producción en Vercel
3. Analizará commits conventional
4. Creará nueva versión si corresponde
5. Generará CHANGELOG.md
6. Creará GitHub Release
7. Sincronizará develop con main

### Preview en Pull Request
1. Crea un Pull Request desde cualquier rama
2. El workflow automáticamente:
   - Ejecutará CI checks
   - Creará un deploy de preview
   - Comentará en el PR con la URL de preview
3. Cada nuevo push actualiza el preview

### Deploy Manual
Puedes ejecutar workflows manualmente desde:
**GitHub → Actions → [Nombre del workflow] → Run workflow**

## 📊 Status Badges

Agrega estos badges a tu README principal:

```markdown
![CI](https://github.com/humexxx/cv-galaxy/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/humexxx/cv-galaxy/actions/workflows/deploy.yml/badge.svg)
```

## 🔍 Troubleshooting

### Error: "Context access might be invalid"
Los warnings de ESLint en archivos YAML son normales y no afectan la funcionalidad.

### Error en deployment
1. Verifica que todos los secrets estén configurados correctamente
2. Asegúrate de que el proyecto esté vinculado a Vercel
3. Revisa los logs en la pestaña Actions de GitHub

### Build falla localmente pero pasa en CI
Asegúrate de tener las mismas versiones de Node (20) y dependencias actualizadas con `npm ci`.

### Semantic Release no crea versión
- **Verifica tus commits**: Deben seguir Conventional Commits (feat, fix, etc.)
- **Revisa el log del workflow**: GitHub Actions → Semantic Release
- **Commits sin tipo válido**: `docs`, `style`, `refactor`, `test`, `chore` no crean releases
- **Ya existe la versión**: Si no hay nuevos commits feat/fix desde el último release

### Conflictos en sync-develop
Si develop tiene cambios que main no tiene:
```bash
# Resolver manualmente
git checkout develop
git merge main
git push origin develop
```

### No se sincroniza develop automáticamente
- Verifica que el commit en main sea de tipo `chore(release)`
- Revisa los logs del workflow "Sync develop with main"
- El workflow solo corre cuando se modifican `CHANGELOG.md` o `package.json`

## 📝 Notas Adicionales

- Los builds se cachean para acelerar los workflows
- Los artefactos de build se guardan por 7 días
- El CI debe pasar antes de poder hacer merge de PRs (configurable en branch protection rules)

