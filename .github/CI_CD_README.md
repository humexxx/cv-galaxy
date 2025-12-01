# CI/CD Configuration

Este proyecto está configurado con GitHub Actions para CI/CD automático.

## 📋 Workflows Configurados

### 1. **CI Pipeline** (`.github/workflows/ci.yml`)
Se ejecuta en cada push y pull request a las ramas `develop` y `main`.

**Incluye:**
- ✅ ESLint
- ✅ TypeScript Type Check
- ✅ Build de Next.js
- ✅ Subida de artefactos de build

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

### Deploy a Producción
```bash
git push origin main
```
Esto automáticamente:
1. Ejecutará el pipeline de CI
2. Desplegará a producción en Vercel

### Preview en Pull Request
1. Crea un Pull Request desde cualquier rama
2. El workflow automáticamente:
   - Ejecutará CI checks
   - Creará un deploy de preview
   - Comentará en el PR con la URL de preview

### Deploy Manual
Puedes ejecutar el deploy manualmente desde:
**GitHub → Actions → Deploy to Vercel → Run workflow**

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

## 📝 Notas Adicionales

- Los builds se cachean para acelerar los workflows
- Los artefactos de build se guardan por 7 días
- El CI debe pasar antes de poder hacer merge de PRs (configurable en branch protection rules)

