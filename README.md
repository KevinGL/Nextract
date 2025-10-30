# 🧠 Nextract

> Nextract est une application Next.js qui génère automatiquement un **rapport quotidien de l'actualité**, basé sur l’article à la une de **France Info**.  
> Un **Cron Job** exécute une requête API sécurisée qui :
> - effectue un **scraping** de l’article du jour,
> - interroge **Gemini** pour en produire un résumé,
> - et stocke le résultat en base de données (Supabase).

🔗 Accès à la version en ligne : [https://nextract-bx0r.onrender.com/signup](https://nextract-bx0r.onrender.com/signup)

---

## ⚙️ Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/ton-compte/nextract.git
   cd nextract
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   Crée un fichier `.env` à la racine du projet avec :
   ```
   DATABASE_URL=URL_VERS_BDD_SUPABASE
   NEXT_PUBLIC_SUPABASE_URL=URL_PROJET_SUPABASE
   NEXT_PUBLIC_SUPABASE_ANON_KEY=CLE_SUPABASE
   GEMINI_API_KEY=CLE_API_GEMINI
   ENCRYPTION_SECRET=CLE_CRYPTO_IDS
   CRON_KEY=CLE_AUTORISATION_CRON
   ```

4. **Initialiser Prisma**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

5. **Lancer le serveur**
   ```bash
   npm run dev
   ```

---

## 🧱 Architecture du projet

```
src/
├── app/
│   ├── actions/       → Server actions (inscription, rapports, requêtes Gemini)
│   ├── api/           → Route API (scraping)
│   ├── dashboard/     → Page principale
│   ├── chat/          → Chat IA
│   ├── login/         → Connexion
│   └── signup/        → Inscription
├── components/        → UI components + Navbar
├── lib/               → Prisma client, Supabase client
├── security/          → Middlewares + crypto utils
```

---

## 🧩 Modules-clés

| Module | Utilisation |
|---------|-------------|
| `@google/genai` | API Gemini (résumé & chat IA) |
| `cheerio` | Scraping HTML |
| `@supabase/ssr` | Authentification Supabase |
| `prisma` | ORM PostgreSQL |
| `crypto` | Cryptage réversible des IDs |

---

## 📰 Scraping et génération de rapport

### Extraction de l’article du jour

```ts
// Récupération contenu page d’accueil
let res = await fetch(uri);
let html = await res.text();
let $ = cheerio.load(html);

// Lien vers l'article principal
const link = uri + $('article.card-article-majeure a').attr("href");

// Contenu de l'article
res = await fetch(link);
html = await res.text();
$ = cheerio.load(html);

// Récupération du titre et du chapeau
const title: string = cleanText($('h1.c-title').text());
const hat: string = cleanText($('p.c-chapo').text());
```

### Structuration des données

```ts
const parts: ScrapingPart[] = [
  { tag: "h1", text: title },
  { tag: "p", text: hat }
];

$('div.c-body h2, div.c-body p').each((_, el) => {
  const tag = el.tagName;
  const text = cleanText($(el).text());
  parts.push({ tag, text });
});

// Conversion en texte brut
const content = parts.map(p => p.text).join("\n\n");
```

### Appel à Gemini

```ts
const summary = await AI_Summary(content);

await prisma.report.create({
  data: {
    createdAt: new Date(),
    data: JSON.stringify(parts),
    summary: summary ?? "Aucun résumé disponible"
  }
});
```

---

## 🧠 IA – Fonction `AI_Summary()`

```ts
import { GoogleGenAI } from "@google/genai";

export default async function AI_Summary(article: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Pourrais-tu résumer cet article stp : \n\n${article}`
  });

  return res.text;
}
```

---

## 💬 Chat IA (Gemini)

Chaque conversation est enrichie du **contexte** (les rapports existants) pour permettre à l’IA de répondre avec cohérence.

```ts
// Contexte initial : résumés de tous les rapports
let context = "";
reports.map((report) => {
  context += `Rapport du ${new Date(report.createdAt).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })}\n${report.summary}\n\n`;
});

// Historique de conversation
const chatHistory = messages.map((msg, i) => ({
  role: msg.author === "Nextract IA" ? "model" : "user",
  parts: [{ text: i === 0 ? context + msg.content : msg.content }]
}));

// Requête IA
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const res = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: chatHistory
});
```

---

## 🔐 Sécurité

- Authentification Supabase (email + mot de passe)
- Pages protégées par middleware
- Données sensibles dans `.env`
- API Cron sécurisée par clé `Authorization: Bearer`
- IDs de BDD cryptés avec AES-256

---

## ⚙️ Choix techniques

- **Gemini** : API plus souple que GPT pour le résumé d’articles
- **France Info** : source libre d’accès et structurée
- **Render** : déploiement choisi après problème Prisma sur Vercel

---

## 🚀 Améliorations possibles

- 💬 Système de commentaires et réactions sur les articles
- 👮 Espace d’administration (modération)
- 💾 Sauvegarde des conversations IA
- 📊 Tableau de bord statistique sur les tendances quotidiennes
