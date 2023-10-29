# Backend DMI

## Stack

-   [Bun](https://bun.sh/) : JavaScript Runtime, Package manager, Bundler...
-   [Hono](https://hono.dev/) : Framework Web.
-   [Drizzle](https://orm.drizzle.team/) : ORM
-   [Zod](https://zod.dev/) : Validation de données par schéma orienté TypeScript

## Développement en local

### Pour installer Bun (WSL, Linux et MacOS uniquement !)

```bash
curl -fsSL https://bun.sh/install | bash
```

Si la commande bun n'est pas reconnue après l'installation, essayer de l'ajouter manuellement au path (voir [ici](https://dev.to/vanwildemeerschbrent/bun-command-not-found-on-linux-4n16))

### Pour créer la base de données sqlite (racine du projet) :

```bash
touch database.sqlite
```

### Pour installer les dépendances et lancer le projet en local

```bash
bun install
bun run dev
```

### Pour voir la documentation swagger :

```
http://localhost:3000/swagger
```
