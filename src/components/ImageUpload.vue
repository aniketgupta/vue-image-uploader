// created by Aniket Gupta on 23.04.2018
<template>
  <div>
    <button type="button" class="btn btn-sm btn-labeled btn-info btn-block" @click="openUploadModal">Upload Image</button>
    <button type="button" class="btn btn-sm btn-labeled btn-info btn-block" @click="goToImages">Go To Images</button>                  
    <!-- Modal -->
    <div class="modal fade" id="editModal" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Upload Image</h4>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-4">
                <form enctype="multipart/form-data" id="newImageForm">
                  <input id="fileLoader" type="file" name="image" accept="image/*" @change="changeImage"/>
                </form>
                <button type="button" class="btn btn-labeled btn-info btn-block" @click="openFileDialog">Change Image</button>                  
              </div>
              <div class="col-md-8" v-if="openCropper">
                <p class="text-center">New Image</p>
                <div v-if="openCropper" style=" border: 1px solid gray; display: inline-block;">
                  <vue-cropper
                    ref='cropper'
                    :guides="true"
                    :view-mode="2"
                    drag-mode="move"
                    :background="true"
                    :rotatable="true"
                    :zoomable="true"
                    :zoom-on-touch="true"
                    :zoom-on-wheel="true"
                    :aspectRatio="1/1"
                    :cropBoxResizable="false"
                    :src="newImgSrc"
                    alt="New Image"
                   >
                  </vue-cropper>
                </div>
                <br>
                <div class="btn-group">
                  <button class="btn btn-primary" type="button" title="Zoom In" @click="zoomIn" v-if="newImgSrc != ''">
                    <span class="fa fa-search-plus"></span>
                  </button>
                  <button class="btn btn-primary" type="button" title="Zoom Out" @click="zoomOut" v-if="newImgSrc != ''">
                    <span class="fa fa-search-minus"></span>
                  </button>
                </div>
                <div class="btn-group">
                  <button class="btn btn-primary" type="button" title="Rotate Left" @click="rotateLeft" v-if="newImgSrc != ''">
                    <span class="fa fa-rotate-left"></span>
                  </button>
                  <button class="btn btn-primary" type="button" title="Rotate Right" @click="rotateRight" v-if="newImgSrc != ''">
                    <span class="fa fa-rotate-right"></span>
                  </button>
                </div>
                <div class="btn-group">
                  <button class="btn btn-primary" type="button" title="Reset" @click="reset" v-if="newImgSrc != ''">
                    <span class="fa fa-refresh"></span>
                  </button>
                  <button class="btn btn-primary" type="button" title="Cancel" @click="clearData" v-if="newImgSrc != ''">
                    <span class="fa fa-ban"></span>
                  </button>
                  <button class="btn btn-primary" type="button" title="OK" @click="uploadImage" v-if="newImgSrc != ''">
                    <span class="fa fa-check"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import toastr from 'toastr';
import VueCropper from 'vue-cropperjs';

export default {
  name: 'ImageUpload',
  components: {
    VueCropper,
  },
  data() {
    return {
      openCropper: false,
      newImgSrc: '',
    };
  },
  methods: {
    goToImages() {
      this.$router.push('/images');
    },
    openUploadModal() {
      window.$('#editModal').modal('toggle');
    },
    openFileDialog() {
      $('#fileLoader').click();
    },
    changeImage(e) {
      const file = e.target.files[0];
      if (!file.type.includes('image/')) {
        toastr.error('Please select an image file.');
        return;
      }
      if (file.size > 2 * 1000 * 1000) {
        toastr.error('Please select an image upto the size of 2MB.');
        return;
      }
      if (typeof FileReader === 'function') {
        this.openCropper = true;
        const reader = new FileReader();
        reader.onload = (event) => {
          this.newImgSrc = event.target.result;
          // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        toastr.error('Sorry, FileReader API not supported');
      }
    },
    zoomIn() {
      this.$refs.cropper.relativeZoom(0.1);
    },
    zoomOut() {
      this.$refs.cropper.relativeZoom(-0.1);
    },
    rotateRight() {
      this.$refs.cropper.rotate(90);
    },
    rotateLeft() {
      this.$refs.cropper.rotate(-90);
    },
    reset() {
      this.$refs.cropper.reset();
    },
    clearData() {
      this.openCropper = false;
      this.newImgSrc = '';
      document.getElementById('newImageForm').reset();
    },
    uploadImage() {
      const cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
      const url = 'http://localhost:8080/api/v1/db/images';
      this.$http.post(url, { image_url: cropImg }).then(
        () => {
          toastr.success('Image uploaded successfully');
          this.clearData();
        },
        (error) => {
          if (error.body.statusCode === 413) {
            toastr.error('Error: Image is greater than 2MB.');
          } else {
            toastr.error(error.body.message);
          }
        },
      );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

/* Grid styles -------------------------------------------------*/

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 30px;
}

/* Generic styles ----------------------------------------------*/

.cards {
  max-width: 960px;
  margin: 0 auto 30px;
}

article {
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: .3s ease;
  background-color: rgba(255, 255, 255, 0.2);
}

article:hover .overlay {
  opacity: 1;
}

.edit-icon {
  color: white;
  font-size: 70px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}

.cancel-icon {
  color: white;
  font-size: 30px;
  position: absolute;
  top: 8%;
  right: 0%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}

.fa-pencil:hover, .fa-times:hover {
  color: #eee;
}

.article-img {
  height: 200px;
  width: 100%;
  object-fit: cover;
}

.original-img {
  width: 100%;
  height: 100%;
  margin-bottom: 15px;
}

#fileLoader {
  display: none;
}

.margin-zero {
  margin-left: 0;
  margin-right: 0;
}
</style>
