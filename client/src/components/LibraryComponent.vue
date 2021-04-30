<template>
  <div>
    <form @submit.prevent="sendFile" enctype="multipart/form-data">
      <div class="field">
        <div class="file is-boxed is-primary">
          <label class="label">
            <input 
              type="file" 
              ref="file"
              @change="selectFile"
              accept="audio/*"
              class="file-input"
            />
            <span class="file-cta">
              <span class="file-icon">
                <i class="fas fa-upload">

                </i>
              </span>
              <span class="file-label">
                Choose a file...
              </span>
            </span>

            <span v-if="file" class="file-name">{{file.name}}</span>
          </label>

        </div>

      </div>

      <div class="field">
        <button class="button is-info">Send</button>
      </div>
      <p class="error" v-if="error">{{error}}</p>
    </form>
    <hr>
    <div class="content">
        <h1 class="title">My audio list</h1>
    </div>
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
    },
    selectFile() {
      this.file = this.$refs.file.files[0];
    } 
  },
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .content {
    width: 650px;
    margin: auto;
  }
  .field {
    display: flex;
    justify-content: center;
  }
  .file-cta {
    width: 100%;
  }
  h1 {
    text-align: center;
  }
  p.error {
    border: 1px solid #ff5b5f;
    background-color: #ffc5c1;
    padding:  10px;
    margin-bottom: 15px;
  }
</style>
