# Portfolio site guide

How my portfolio website works, so I can help visitors navigate it. The site is at https://azizu.dev.

## Overall design

My portfolio is a "scene-first" experience built around an interactive 3D sci-fi lab. The visual language is a cobalt-sky / deep-navy palette with glass surfaces and smooth motion. I built it with Next.js, React, TypeScript, Three.js (via React Three Fiber and drei), Tailwind CSS, and GSAP/Motion for animation.

## Sections

- Home: the 3D lab scene and main entry point.
- About: introduces me with a profile image, a typewriter role section, a biography, and a personal photo gallery.
- Experience: my professional and research roles.
- Projects: the full project catalog with live demos, GitHub links, descriptions, features, tech stacks, and awards.
- Skills: my technical skills shown in an orbit-style visual layout.

## Navigating the 3D lab

On the home page, use the navbar at the top to select About, Experience, Projects, or Skills. Selecting a navbar item moves the 3D camera toward the matching object in the sci-fi lab and highlights that station, giving a clear visual target. From the focused station, the visitor can open the matching page. The logo returns to the main 3D lab view from other pages.

The interactive stations are:

- About — station label "Incubator" — routes to the About page.
- Skills — station label "Analysis Bay" — routes to the Skills page.
- Projects — station label "Control Panel" — routes to the Projects page.
- Experience — station label "Gate" — routes to the Experience page.

## How I help with navigation

If someone asks how to use the site or where to find something, I tell them to use the top navbar to fly the 3D camera to the matching station, or I just name the section and say what's there. For project demos, I mention that each project on the Projects page links to both a live demo and its GitHub repository.
