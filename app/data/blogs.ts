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
    id: "2",
    title: "The Art of being Uncomfortable",
    slug: "the-art-of-being-uncomfortable",
    date: "2025-12-02",
    excerpt:
      "Growth rarely happens in moments of ease. Over the past few years as a student, an engineer, and someone who is always trying to build something new, I've learned that being uncomfortable isn't something to avoid. It's something to seek out.",
    content: `# The Art of being Uncomfortable
    
![IMAGE:/blog-images/choosing-discomfort-pushing-beyond-familiar-1.jpg]
Growth rarely happens in moments of ease. Over the past few years as a student, an engineer, and someone who is always trying to build something new I've learned that being uncomfortable isn't something to avoid. It's something to seek out.

Discomfort is the space between where I am and where I want to be. It's the feeling that tells me I'm doing something new, something uncertain, something that requires me to stretch further than before. And while it's rarely pleasant, it's almost always the place where I learn the most.


## The Value of Being Uncomfortable

When I first started pushing myself into unfamiliar territory new technologies, leadership roles, bigger projects I realised how quickly comfort can become a trap. It lulls you into doing the same things the same way, even if you know you're capable of more.

Being uncomfortable forces me to confront weaknesses instead of working around them. It reveals what I don't know and challenges me to fill those gaps. Whether it's tackling a new engineering discipline, taking on a leadership role, or speaking to people who intimidate me, discomfort becomes a tool for self-assessment and improvement.

It's also where confidence is built. There's a moment after you've struggled through something difficult where you realise it didn't beat you you adapted, you figured it out, you grew. That experience compounds. The next challenge feels a little less overwhelming.

![IMAGE:/blog-images/choosing-discomfort-pushing-beyond-familiar-2.jpg]

## Why I Seek It Out Personally

My drive to step into discomfort comes from a simple belief: if I stay still, I fall behind. Engineering, tech, and even life itself move too fast for comfort to be a long-term strategy. I've had to learn new technologies on short timelines, guide teams through unclear requirements, and put myself in situations where I had no guarantee of success. Each time, that initial discomfort became the spark that pushed me toward something better.

I've also seen how avoiding discomfort limits potential. Some of the best moments in my academic and professional life from founding a robotics club, to leading workshops, to building products I had no roadmap for only happened because I said yes before I felt fully ready.

Discomfort, for me, isn't just a challenge. It's a philosophy. It reminds me that improvement is a deliberate choice, and that the most rewarding opportunities often begin with uncertainty.

## Growing Through the Unfamiliar

I won't pretend that choosing discomfort is easy. There are days I hesitate. Days self-doubt creeps in. Days I question whether I've taken on too much. But I've learned that the feeling of being uncomfortable is temporary. What it creates skills, resilience, new opportunities is lasting.

The more I push myself into situations that stretch my abilities, the broader my world becomes. New ideas, new people, new possibilities all of it starts with a willingness to be uncomfortable.

And that's why I continue to choose it. Not because it feels good in the moment, but because of who I become by moving through it.`,
    author: "Kevin Chen",
    tags: [
      "Personal Thoughts",
      "Self-Improvement",
    ],
  },
  {
    id: "1",
    title: "Building My Portfolio: A Deep Dive into the Tech Stack",
    slug: "building-my-portfolio-tech-stack",
    date: "2025-11-21",
    excerpt:
      "A comprehensive overview of the technologies, tools, and practices I used to build this modern portfolio website, from Next.js and React to Git version control and Vercel hosting.",
    content: `# Building My Portfolio: A Deep Dive into the Tech Stack
![IMAGE:/blog-images/Portfolio.jpg]
When I set out to build my personal portfolio website, I wanted to create something that not only showcases my work but also demonstrates modern web development practices. In this post, I'll walk you through the complete tech stack I used to bring this site to life.

![IMAGE:/blog-images/next-js-seeklogo.svg]

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

![IMAGE:/blog-images/Vercel_logo_2025.svg]

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
      "Engineering",
      "Web Development",
    ],
  },
];
