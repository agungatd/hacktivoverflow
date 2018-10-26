<template>
 <section class="share">
   <div id="sharebar">
     <div class="share-buttons">
       <div id="share">
         <a class="facebook" v-on:click.prevent="openFacebook">
           <i class="fa fa-facebook"></i>
         </a>
         <a class="twitter" v-on:click.prevent="openTwitter">
           <i class="fa fa-twitter"></i>
         </a>
         <a class="googleplus" v-on:click.prevent="openGplus">
           <i class="fa fa-google-plus"></i>
         </a>
         <a class="linkedin" v-on:click.prevent="openLinkedin">
           <i class="fa fa-linkedin"></i>
         </a>
         <a class="pinterest" v-on:click.prevent="openPinterest">
           <i class="fa fa-pinterest-p"></i>
         </a>
       </div>
     </div>
   </div>
 </section>
</template>

<script>
 export default {
   name: 'share',
   props: ['article','user'],
   mounted() {

   },
   data() {
     return {
       url: 'http://hacktiv-overflow-220410.firebaseapp.com/',
       shareUrl : `http://hacktiv-overflow-220410.firebaseapp.com/home/${this.article._id}`,
       title: 'Go-Blog ID',
       source: 'http://hacktiv-overflow-220410.firebaseapp.com/',
       media: '',
       twit: ''
     }
   },
   methods: {
     openFacebook() {
       window.open(`https://www.facebook.com/share.php?u=${this.shareUrl}&title=${this.title}`, 'popup', 'width=600,height=600')
     },
     openTwitter() {
       window.open(`https://twitter.com/intent/tweet?status=${this.twit?this.twit:this.shareUrl}`, 'popup', 'width=600,height=600')
     },
     openGplus() {
       window.open(`https://plus.google.com/share?url=${this.shareUrl}`, 'popup', 'width=600,height=600')
     },
     openLinkedin() {
       window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${this.shareUrl}&title=${this.title}&source=${this.shareUrl}`, 'popup', 'width=600,height=600')
     },
     openPinterest() {
       window.open(`https://pinterest.com/pin/create/bookmarklet/?media=${this.media}&url=${this.shareUrl}&is_video=false&description==${this.title}`, 'popup', 'width=600,height=600')
     }
   },
   computed: {

   }
 }
</script>

<style scoped lang="css">
 .share {
   width: 100%;
 }

 #share {
   width: 100%;
   display: grid;
   grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
   justify-items: center;
 }

 #share a {
   height: 100%;
   cursor: pointer;
 }


</style>