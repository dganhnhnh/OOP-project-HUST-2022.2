import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

const MyEditor = ({text, setText}) => {

  const handleImageUpload = (blobInfo, success, failure) => {
    var xhr, formData;

    xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open('POST', 'http://localhost:8080/api/File/uploadImage');

    xhr.onload = function () {
      var json;

      if (xhr.status !== 200) {
        failure('HTTP Error: ' + xhr.status);
        return;
      }

      json = JSON.parse(xhr.responseText);

      if (!json || typeof json.location !== 'string') {
        failure('Invalid JSON: ' + xhr.responseText);
        return;
      }

      success(json.location);
    };

    formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());

    xhr.send(formData);
  };

  return (
    <Editor
      apiKey="joa43a6hj4riv0j75ojawnh5kqsfobdcml2kbcr891d7cgxr"
      init={{
        plugins: [
          'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
          'searchreplace', 'wordcount', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media',
          'table', 'emoticons', 'template', 'help'
        ],
        toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
        'forecolor backcolor emoticons | help',
        images_upload_url: 'http://localhost:8080/api/File/uploadImage',
        images_upload_handler: handleImageUpload,
        imagetools_cors_hosts: ['localhost:8080'], // Thêm tên miền nơi bạn lưu trữ hình ảnh
        imagetools_proxy: '/imagetools-proxy', // Đường dẫn đến proxy nếu cần thiết
        imagetools_fetch_image: true, // Cho phép trình soạn thảo tải hình ảnh từ URL
      }}
      value={text}
      onEditorChange={setText}
    />
  );
};

export default MyEditor;
