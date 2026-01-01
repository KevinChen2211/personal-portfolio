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
    id: "3",
    title: "The Year Ahead",
    slug: "the-year-ahead",
    date: "2026-01-01",
    excerpt: "Looking forward to the new year and what i want to achieve",
    content: ` ![IMAGE:/blog-images/The-Year-Ahead.jpg]
    New Year's resolutions have never really been my thing. I'd usually set one vaguely ambitious goal, give the year a dramatic name, and then more or less just vibe my way through it. Now that I've graduated, I don't really have an excuse not to be more deliberate about improving myself. So this year, I've decided to hold myself accountable by setting smaller, more achievable goals. 
    
    - The first goal I want to commit to is reading more, especially non-fiction. If I manage to stick to it, I'll be sharing my thoughts and short reviews of what I read here. 
    
    - The second goal is to put myself out there more: volunteering, taking part in new activities, and getting involved in projects that broaden my experiences and push me into spaces I wouldn't normally explore. 
    
    - The final goal is to make healthier day-to-day decisions, whether that means skipping the upsized meal or being more mindful about how much time I spend doom-scrolling.

    ---

    Either way, I think focusing on smaller, more attainable goals gives me a better chance of actually following through. Progress does not have to be dramatic to be meaningful, and consistency matters far more than grand intentions. If I can show up for these goals regularly, even in small ways, that will be a win in itself.
    `,
    author: "Kevin Chen",
    tags: [
      "Self-Improvement"
    ],
  },
  {
    id: "2",
    title: "The Art of being Uncomfortable",
    slug: "the-art-of-being-uncomfortable",
    date: "2025-12-02",
    excerpt:
      "Growth rarely happens in moments of ease. Over the past few years as a student, an engineer, and someone who is always trying to build something new, I've learned that being uncomfortable isn't something to avoid. It's something to seek out.",
    content: `![IMAGE:/blog-images/choosing-discomfort-pushing-beyond-familiar-1.jpg]

I have spent most of my life trying to be comfortable. Over the past few years, as a student, an engineer, and someone who is always trying to build something new, I've learned that being uncomfortable isn't something to avoid. It's something I should seek out.

## Why I Think It's Good to Be Uncomfortable

When I first started pushing myself into new technologies, roles, and bigger projects, I realised how quickly comfort can become a trap. I stop looking for more, and I stop wanting more from myself. Being uncomfortable forces me to face my weaknesses instead of working around them.

I believe that this is also where confidence is built. There's a moment after you've struggled through something difficult where you realise you beat it, you've adapted, you've figured it out, and you've grown. That experience is what I am after right now, making the next challenge feel a little less overwhelming.

## Why I Seek It Out Personally

I've also seen how avoiding discomfort limits me. Some of the best moments in my life only happened because I said yes before I felt fully ready. Discomfort, for me, isn't just a challenge. It's a philosophy. It reminds me that improvement is a deliberate choice, and that the most rewarding opportunities often begin with uncertainty.

---

The more I push myself into situations that stretch my abilities, the larger my world becomes. New ideas, new people, new possibilities — all of it starts with a willingness to be uncomfortable.

It's taken the better part of 20 years for me to figure this out. Better late than never.
`,
    author: "Kevin Chen",
    tags: [
      "Personal Thoughts",
      "Self-Improvement",
    ],
  },
  {
    id: "1",
    title: "Building My Portfolio: A Dive into the Tech Stack",
    slug: "building-my-portfolio-tech-stack",
    date: "2025-11-21",
    excerpt:
      "A comprehensive overview of the technologies, tools, and practices I used to build this modern portfolio website, from Next.js and React to Git version control and Vercel hosting.",
    content: `![IMAGE:/blog-images/Portfolio.jpg]

This website has been in constant development since 2021. It has evolved over the years and changed styling as my preferences have changed.

![IMAGE:/blog-images/next-js-seeklogo.svg]

## Frontend Framework

At the core of this portfolio is **Next.js**. The main reason for choosing this frontend framework is its wide adoption within industry.

## Type Safety with TypeScript

With many in the industry using TypeScript (even if a few have reverted back), I decided to keep everything in my portfolio aligned with what you would typically see used by companies and the wider public.

## Styling with Tailwind CSS 4

For styling, I chose **Tailwind CSS**. I was originally against Tailwind due to how hard it is to read; however, after using it for a while and learning the shorthand, it has been relatively easy to use and style the site.

## Version Control with Git

Like the majority of source control on the internet, I am using Git, with GitHub as the provider.

![IMAGE:/blog-images/Vercel_logo_2025.svg]

## Deployment & Hosting: Vercel

Vercel was chosen due to how well it fits my requirements:
- Low cost  
- Fast deployment  
- Integration with tools I am familiar with  

The integration between Git and Vercel allows my site to build and deploy extremely quickly. I push code to Git, and Vercel automatically builds and deploys it.

## Development Workflow

My development workflow typically looks like this:

1. **Local Development** - Work on features locally  
2. **Git Branching** - Create feature branches for new work  
3. **Testing** - Test thoroughly in the browser  
4. **Commit & Push** - Commit changes with descriptive messages and push to Git  
5. **Create a Pull Request** - Ensure that my GitHub Actions build successfully  
6. **Vercel Deployment** - Vercel automatically builds and deploys  
7. **Review** - Check the live site and preview deployments  
`,
    author: "Kevin Chen",
    tags: [
      "Engineering",
      "Web Development",
    ],
  },
];
