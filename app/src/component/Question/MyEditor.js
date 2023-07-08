import React from 'react';
import { Editor} from '@tinymce/tinymce-react';


const MyEditor = ({text, setText}) => {

  const handleVideoUpload = (blobInfo, cb) => {
    var xhr, formData;
    const endPoint = "http://localhost:8080/api/File/video/";
  
    xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open('POST', 'http://localhost:8080/api/File/uploadVideo');
  
    xhr.onload = function () {
      var res;
  
      if (xhr.status !== 200) {
        console.log('HTTP Error: ' + xhr.status);
        alert('Video upload failed!');
        return;
      }
  
      res = xhr.responseText;
      console.log(res);
      cb(endPoint + res);
    };
  
    formData = new FormData();
    formData.append('video', blobInfo.blob, blobInfo.filename);
    xhr.send(formData);
  };
  
  const handleImageUpload = (blobInfo, success) => {
    var xhr, formData;
    const endPoint = "http://localhost:8080/api/File/Image/";

    xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open('POST', 'http://localhost:8080/api/File/uploadImage');

    xhr.onload = function () {
      var res;

      if (xhr.status !== 200) {
        console.log('HTTP Error: ' + xhr.status);
        return;
      }

      res = xhr.responseText;
      setText(prevText => prevText + "<p><img src="+endPoint+res+"></p>");
      success(res.location);
    };

    formData = new FormData();
    formData.append('image', blobInfo.blob(), blobInfo.filename());

    xhr.send(formData);
  };

  return (
    <Editor
      apiKey="joa43a6hj4riv0j75ojawnh5kqsfobdcml2kbcr891d7cgxr"
      init={{
        plugins: ["image", "preview", "wordcount", "code", "media"],
        images_upload_url: "http://localhost:8080/api/File/uploadImage",
        images_upload_handler: handleImageUpload,
        imagetools_cors_hosts: ["localhost:8080"], // Thêm tên miền nơi bạn lưu trữ hình ảnh
        imagetools_proxy: "/imagetools-proxy", // Đường dẫn đến proxy nếu cần thiết
        imagetools_fetch_image: true, // Cho phép trình soạn thảo tải hình ảnh từ URL

        file_picker_types: "media",
        file_picker_callback: function (cb, value, meta) {
          var input = document.createElement("input");

          input.setAttribute("type", "file");
          input.setAttribute("accept", "video/*");

          input.onchange = function () {
            var file = this.files[0];

            if (file.type.indexOf("video") !== -1) {
              var reader = new FileReader();

              reader.onload = function () {
                handleVideoUpload(
                  { blob: file, filename: file.name },
                  function (location) {
                    cb(location, { title: file.name });
                  }
                );
              };

              reader.readAsDataURL(file);
            }
          };
          input.click();
        },
      }}
      value={text}
      onEditorChange={setText}
    />
  );
};

export default MyEditor;