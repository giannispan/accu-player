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
      <div class="columns">
        <div id="waveform" class="column is-four-fifths"></div>
        <div class="column">
          <button @click.prevent="playPause()" class="button is-primary is-small">
            <span v-show="isPlaying"><i class="fas fa-pause"></i>Pause</span>
            <span v-show="!isPlaying"><i class="fas fa-play"></i>Play</span>
          </button>
        </div>
      </div>
      <div class="panel list-group">
          <span class="sound-item" v-for="(file,index) in files" :key="index">
            <a @click.prevent="loadSound(file)">
              {{file}}
            </a>
            <button :disabled="files.length == 1" class="button is-danger is-small delete-button ml-6" @click="deleteFile(file)">
              <span class="fa fa-trash"></span>
            </button>
          </span>
      </div>
    </div>
  </div>
</template>

<script>
import FileService from '../FileService';
import WaveSurfer from 'wavesurfer.js';

export default {
  name: 'LibraryComponent',
  data() {
    return {
      files: [],
      file: undefined,
      error: '',
      wavesurfer: null
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
        this.file = undefined;
    },
    deleteFile(file) {
      // prevent from empty list
      if (this.files.length == 1) {
        return
      }
      FileService.removeFile(file)
        .then(() => {
          return FileService.getFiles();
        })
        .then(response => {
          this.files = response.data;
        })
        .catch(err => {
          console.log(err)
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
    },
    createWaveSurfer() {
      this.wavesurfer = WaveSurfer.create({
        container: "#waveform",
        hideScrollbar: true,
        barWidth: 1,
        waveColor: "#00d1b2",
        fillParent: true
      })
    },
    playPause() {
      this.wavesurfer.playPause();
    },
    loadSound(sound) {
      if (sound && this.wavesurfer) {
        this.wavesurfer.load(require('../../../server/resources/static/assets/uploads/' + sound));
      }
    }
  },
  computed: {
    isPlaying() {
      return this.wavesurfer && this.wavesurfer.isPlaying();
    }
  },
  mounted() {
    if (!this.wavesurfer) this.createWaveSurfer();
    FileService.getFiles()
      .then(response => {
        this.files = response.data;
        // Always load the first track in list
        this.wavesurfer.load(require('../../../server/resources/static/assets/uploads/' + this.files[0]));
      })
      .catch(err => {
        console.log(err)
      })
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
  .sound-item {
    display: table;
    margin: auto;
    width: 450px;
    padding: 10px;
  }
  .delete-button {
    float: right;
    position: relative;
  }
</style>
