export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
  author?: string;
  tags?: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building My Portfolio: A Deep Dive into the Tech Stack",
    slug: "building-my-portfolio-tech-stack",
    date: new Date().toISOString().split("T")[0],
    excerpt:
      "A comprehensive overview of the technologies, tools, and practices I used to build this modern portfolio website, from Next.js and React to Git version control and Vercel hosting.",
    content: `# Building My Portfolio: A Deep Dive into the Tech Stack

When I set out to build my personal portfolio website, I wanted to create something that not only showcases my work but also demonstrates modern web development practices. In this post, I'll walk you through the complete tech stack I used to bring this site to life.

## Frontend Framework: Next.js 16 & React 19

At the core of this portfolio is **Next.js 16**, the latest version of the React framework. Next.js provides an excellent developer experience with features like:

- **Server Components** for optimal performance
- **App Router** for modern routing and layouts
- **Built-in optimizations** for images, fonts, and scripts
- **TypeScript support** out of the box

I'm using **React 19**, which brings improved performance and new features like automatic batching and concurrent rendering. The component-based architecture makes the codebase maintainable and allows for reusable UI elements like the magic text effect, smooth scroll container, and theme toggle.

## Type Safety with TypeScript

**TypeScript** is integrated throughout the project, providing:

- Type safety at compile time
- Better IDE autocomplete and IntelliSense
- Self-documenting code through type definitions
- Early error detection before runtime

This has been invaluable for catching bugs early and making the codebase more maintainable as it grows.

## Styling with Tailwind CSS 4

For styling, I chose **Tailwind CSS 4**, the latest version of the utility-first CSS framework. Tailwind allows me to:

- Build responsive designs quickly with utility classes
- Maintain consistent spacing and color schemes
- Create custom animations and effects
- Keep CSS bundle size minimal through purging unused styles

The theme system I've implemented uses Tailwind's custom properties and CSS variables to enable seamless dark/light mode switching.

## Version Control with Git

**Git** is essential for managing this project's development. I use Git for:

- Tracking changes and maintaining a complete project history
- Branching for feature development and experimentation
- Collaboration and code review workflows
- Rollback capabilities if something goes wrong

The repository structure follows best practices with clear commit messages and organized branches. Git has been crucial for managing the iterative development process, especially when implementing complex features like the magic text animation and smooth scrolling.

## Deployment & Hosting: Vercel

**Vercel** is the perfect hosting platform for this Next.js application. Here's why:

- **Zero-config deployment** - Simply connect your Git repository and Vercel handles the rest
- **Automatic deployments** - Every push to the main branch triggers a new deployment
- **Preview deployments** - Every pull request gets its own preview URL for testing
- **Edge network** - Global CDN ensures fast load times worldwide
- **Analytics & monitoring** - Built-in performance monitoring and analytics
- **Free tier** - Perfect for personal projects with generous limits

The integration between Git and Vercel creates a seamless workflow: I push code to Git, and Vercel automatically builds and deploys it. This CI/CD pipeline means the site is always up-to-date with the latest changes.

## Development Workflow

My development workflow typically looks like this:

1. **Local Development** - Work on features locally using \`npm run dev\`
2. **Git Branching** - Create feature branches for new work
3. **Testing** - Test thoroughly in the browser
4. **Commit & Push** - Commit changes with descriptive messages and push to Git
5. **Vercel Deployment** - Vercel automatically builds and deploys
6. **Review** - Check the live site and preview deployments

## Lessons Learned

Building this portfolio has been a great learning experience. Some key takeaways:

- **Next.js App Router** provides excellent structure for complex applications
- **TypeScript** catches many errors before they reach production
- **Tailwind CSS** speeds up development significantly
- **Git** is essential for managing project evolution
- **Vercel** makes deployment effortless and reliable

## Conclusion

This tech stack - Next.js, React, TypeScript, Tailwind CSS, Git, and Vercel - provides a solid foundation for modern web development. Each tool plays a crucial role in creating a fast, maintainable, and scalable application. The seamless integration between Git and Vercel creates an efficient development workflow that allows me to iterate quickly and deploy with confidence.

If you're building your own portfolio or web application, I highly recommend exploring these technologies. They've made the development process enjoyable and the end result something I'm proud to showcase.`,
    author: "Kevin Chen",
    tags: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Git",
      "Vercel",
      "Web Development",
    ],
  },
];
