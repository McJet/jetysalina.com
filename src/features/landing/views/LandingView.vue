<script setup>
import '../styles/main.css'
import NavBar from '../components/NavBar.vue'
import SiteFooter from '../components/SiteFooter.vue'
import HeroSection from '../components/HeroSection.vue'
import ProjectGrid from '../components/ProjectGrid.vue'
import { projects } from '../data/projects.js'
</script>

<template>
  <NavBar />
  <HeroSection />
  <ProjectGrid :projects="projects" />
  <SiteFooter />
</template>
