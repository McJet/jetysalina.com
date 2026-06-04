import { ExternalLink, Github } from "lucide-vue-next";

export const projects = [
  {
    title: "jetysalina.com",
    image: "/jetysalina.png",
    span: "Aug 2025 - Current",
    description:
      "A website to hold all of my software developer endeavors. Bought the domain and launched the site so that I could have all my fun little project ideas in one central space. Basically a living document that I will update as life goes on.",
    skills: [
      { name: "Vite", link: "https://vite.dev/" },
      { name: "Firebase", link: "https://firebase.google.com/" },
      { name: "Vue.js", link: "https://vuejs.org/" },
      { name: "Lucide", link: "https://lucide.dev/" },
      { name: "Javascript", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    ],
    ctas: [
      { label: "Code", link: "https://github.com/McJet/personal-website", svg: Github },
    ],
  },
  {
    title: "Saddleback.com",
    image: "/saddleback.png",
    span: "Aug 2023 - Current",
    description:
      "I am currently working for Saddleback Church as a Full-Stack Web Developer. Maintaining and building features within the website are a few of the things that I do on a daily basis.",
    skills: [
      { name: "ASP.NET Core", link: "https://dotnet.microsoft.com/en-us/apps/aspnet" },
      { name: "Umbraco CMS", link: "https://umbraco.com/products/umbraco-cms/" },
      { name: "Sass", link: "https://sass-lang.com/" },
      { name: "Vue.js", link: "https://vuejs.org/" },
      { name: "Javascript", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    ],
    ctas: [
      { label: "Visit", link: "https://saddleback.com", svg: ExternalLink },
    ],
  },
  {
    title: "ATM.com",
    image: "/atm.jpg",
    span: "Feb 2022 - Oct 2022",
    description:
      "My professional developer journey started at ATM.com, a fintech startup company. The company's product was a financial app in both iOS and Android. I worked on developing features within the ATM.com Android App.",
    skills: [
      { name: "Kotlin", link: "https://kotlinlang.org/" },
      { name: "Android Studio", link: "https://developer.android.com/studio" },
      { name: "Jetpack Compose", link: "https://developer.android.com/compose" },
    ],
    ctas: [
      { label: "Visit", link: "https://atm.com", svg: ExternalLink },
    ],
  },
]
