# Conventional Commits Guide

Este proyecto usa [Conventional Commits](https://www.conventionalcommits.org/) para versionado automático y generación de CHANGELOG.

## 📝 Formato

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## 🏷️ Tipos de Commits

| Tipo | Descripción | Versión |
|------|-------------|---------|
| `feat` | Nueva funcionalidad | MINOR (1.x.0) |
| `fix` | Corrección de bug | PATCH (1.0.x) |
| `perf` | Mejora de rendimiento | PATCH |
| `docs` | Cambios en documentación | PATCH |
| `refactor` | Refactorización de código | PATCH |
| `style` | Cambios de formato (no afectan código) | No release |
| `test` | Agregar o modificar tests | No release |
| `build` | Cambios en build o dependencias | No release |
| `ci` | Cambios en CI/CD | No release |
| `chore` | Tareas de mantenimiento | No release |
| `revert` | Revertir un commit anterior | PATCH |

## 💥 Breaking Changes

Para indicar un cambio incompatible (MAJOR version):

```bash
feat!: cambio que rompe compatibilidad

# O con footer
feat: nuevo feature

BREAKING CHANGE: esto rompe la API anterior
```

## ✅ Ejemplos Correctos

```bash
# Nueva feature
feat: add search functionality to CVs
feat(search): add fuzzy matching

# Bug fix
fix: resolve mobile menu not closing
fix(ui): correct alignment in sidebar

# Performance
perf: optimize CV search algorithm

# Documentation
docs: update README with new examples
docs(api): add endpoint documentation

# Refactoring
refactor: simplify search component logic

# Breaking change
feat!: migrate to new API endpoint

BREAKING CHANGE: old /api/cv endpoint removed
```

## 🚫 Ejemplos Incorrectos

```bash
# ❌ Sin tipo
added new feature

# ❌ Tipo incorrecto
added: new search

# ❌ Sin descripción clara
fix: stuff

# ❌ Mayúscula inicial
feat: Add search
```

## 🔄 Proceso de Release

1. Haz commits siguiendo Conventional Commits
2. Haz merge a `main`
3. GitHub Actions automáticamente:
   - Analiza los commits
   - Determina la nueva versión
   - Genera CHANGELOG.md
   - Crea un tag de Git
   - Crea un GitHub Release

## 🎯 Scopes Recomendados

- `ui` - Cambios en interfaz
- `api` - Cambios en API
- `search` - Funcionalidad de búsqueda
- `cv` - Gestión de CVs
- `auth` - Autenticación
- `config` - Configuración
- `deps` - Dependencias

## 🛠️ Herramientas

### Commitizen (opcional)
Para ayudarte a escribir commits correctos:

```bash
npm install -g commitizen
git cz  # en lugar de git commit
```

### Validate commits
El proyecto puede validar commits automáticamente con husky + commitlint (opcional).
