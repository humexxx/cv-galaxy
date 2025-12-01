# CV Galaxy

![CI](https://github.com/humexxx/cv-galaxy/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/humexxx/cv-galaxy/actions/workflows/deploy.yml/badge.svg)

A modern platform to discover and share professional CVs. Built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

- 🔍 **Smart Search** - Find CVs by name, title, skills, or keywords
- 🎨 **Modern UI** - Clean, responsive design with dark mode support
- 🚀 **Fast Performance** - Optimized with Next.js 15 and React 19
- 📱 **Mobile Friendly** - Works seamlessly on all devices
- 🔄 **Real-time Search** - Instant results as you type
- 🎯 **Professional Layouts** - Beautiful CV presentation

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI
- **Icons:** Lucide React
- **Theme:** next-themes (Dark/Light mode)
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/humexxx/cv-galaxy.git
cd cv-galaxy

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 🏗️ Project Structure

```
cv-galaxy/
├── app/                    # Next.js App Router pages
│   ├── [username]/        # Dynamic CV pages
│   ├── settings/          # Settings page
│   └── page.tsx           # Home page with search
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── data/                 # CV data and utilities
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🧪 Development

```bash
# Run development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 🚀 CI/CD

This project uses GitHub Actions for automated CI/CD:

- **CI Pipeline**: Runs on every push and PR (linting, type checking, build)
- **Production Deploy**: Auto-deploys to Vercel on push to `main`
- **Preview Deploys**: Creates preview deployments for every PR

See [CI_CD_README.md](.github/CI_CD_README.md) for detailed setup instructions.

## 📝 Adding CVs

To add a new CV, edit `data/cvs.ts` and add your CV data following the `CVData` type structure.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Links

- [Documentation](.github/CI_CD_README.md)
- [Vercel Deployment](https://vercel.com)
- [Next.js Documentation](https://nextjs.org/docs)
