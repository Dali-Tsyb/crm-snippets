<template>
   <div class="page-wrapper">
      <div class="page-body-wrapper">
         <div class="page-body">
            <div class="container-fluid">
               <div class="row">
                  <div class="col-xl-12 m-0 p-0">
                     <RouterView v-slot="{ Component }">
                        <transition name="fade" mode="out-in">
                           <component :is="Component" />
                        </transition>
                     </RouterView>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
