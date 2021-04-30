<template>
  <div>
    
  </div>
</template>

<script>
import FileService from '../FileService';

export default {
  name: 'LibraryComponent',
  data() {
    return {
      files: [],
      file: '',
      error: ''
    }
  },
  methods: {
    sendFile() {
      FileService.upload(this.file)
        .then(() => {
          return FileService.getFiles();
        })
        .then(response => {
          this.files = response.data;
        })
        .catch(err => {
          this.error = err.response.data.message;
          this.file = undefined;

          // Hide error message after 2 seconds
          setTimeout(() => {
            this.error = '';
          }, 2000);
        })
    } 
  },
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
