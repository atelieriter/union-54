# UNION 54

Landing de campagne pour la liste d’union CCI Meurthe-et-Moselle (élections octobre 2027).

Site statique (HTML / CSS / JS), sans build — même logique que Nancy.

## Local

```bash
python3 -m http.server 8765
```

Ouvre [http://127.0.0.1:8765](http://127.0.0.1:8765).

## Déploiement

Comme Nancy / Apo : GitHub + Netlify, zéro build.

- Repo : https://github.com/atelieriter/union-54
- Live : https://union-54.netlify.app
- Admin : https://app.netlify.com/projects/union-54

`netlify.toml` : `publish = "."`, `command = "true"`.  
Push sur `main` → build hook Netlify.  
Formulaire « contribution » = Netlify Forms.
