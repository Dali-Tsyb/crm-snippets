<template>
   <div
      class="container py-4 d-flex flex-column align-items-center justify-content-center"
      style="height: 100vh"
   >
      <h1 class="mb-4 text-center">CRM Snippets</h1>
      <nav class="mb-4">
         <router-link class="btn btn-outline-primary me-2" to="/dashboard"
            >Dashboard</router-link
         >
         <router-link class="btn btn-outline-primary" to="/departments"
            >Departments</router-link
         >
      </nav>
      <router-view />
   </div>
</template>
