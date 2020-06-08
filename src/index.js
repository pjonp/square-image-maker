import ReactDOM from 'react-dom';
import React, {useEffect} from 'react';
import Cropper from 'cropperjs';
import debounce from 'lodash/debounce';
import './index.css';
import '../node_modules/cropperjs/dist/cropper.css'

let cropper = ''

const SquareImageMaker = () => {
  useEffect( () => {
        buildCropper();
    },[]);


  const buildCropper = () => {
    let cropBox = document.getElementById('cropImage')
    let cropPreview = document.getElementById('cropPreview')
    cropper = new Cropper(cropBox, {
        aspectRatio: 1,
        minCropBoxWidth: 100,
        dragMode: 'move',
        cropBoxMovable: false,
        crop: debounce(() => {
          let canvas = cropper.getCroppedCanvas({
            minWidth: 800,
            maxWidth: 1200,
            imageSmoothingQuality: 'high'
          })
          cropPreview.src = canvas.toDataURL('image/png')
        }, 5)
      });
  }
  const makeCropper = (e) => {
      e.preventDefault()
      let upload = e.target.files;
      if(upload.length === 0) return;
      let cropBox = document.querySelector('#cropImage');

      if(!upload[0].name.endsWith('.jpg') && !upload[0].name.endsWith('.png')) {
        alert('Please select a .jpg or .png file.')
        return
      }

      cropper.destroy()

      cropBox.alt= 'Loading Image...'
      cropBox.src = '';
      let reader = new FileReader();
      reader.onload = r => {
          cropBox.alt= 'Image Editor Canvas'
          cropBox.src = r.target.result;
          buildCropper();
          };
      reader.readAsDataURL(upload[0]);
  };

  const getAnswer = () => {
    let answer = prompt("What is the answer?", "???"),
    downloadAnchor = document.getElementById('downloadLinkTarget');
    downloadAnchor.setAttribute('href', document.getElementById('cropPreview').src);
    downloadAnchor.setAttribute('download', answer);
};

  return (
    <div id='SquareImageMaker'>
    {/*  <header>
        <picture>
          <source media='(max-width: 749px)' srcSet={process.env.PUBLIC_URL + '/headerSmall.png'} />
          <source media='(min-width: 750px)' srcSet={process.env.PUBLIC_URL + '/headerLarge.png'} />
          <img src={process.env.PUBLIC_URL + '/headerLarge.png'} alt='Banner' />
        </picture>
      </header>
 */}
      <div id='infoContainer'>
            <p>Upload an image from your device or URL.</p>
            <label className='actionButton'>
              <h2><i className="fas fa-cloud-upload-alt"></i> UPLOAD</h2>
              <input id='photoUpload' type='file' accept='.png, .jpg' name='photo' onChange={makeCropper} hidden />
            </label>
      </div>
      <div id='headerContainer'>
        <h3 className='headerLeft'>Drag/Zoom/Crop</h3>
        <h3 className='headerRight'>Preview</h3>
      </div>

      <div id='imageContainer'>
        <div className='cropBox'>
          <img id='cropImage' src={process.env.PUBLIC_URL + '/startImage.png'} alt='Editor Canvas' />
        </div>
        <div className='previewBox' style={ {'display': 'block'} }>
          <img id='cropPreview' src={process.env.PUBLIC_URL + '/startImage.png'} alt='Cropped Preview' />
        </div>
      </div>

      <div id='infoContainer'>
        <p>Save with a name that matches this image!</p>
        <a id='downloadLinkTarget' className='actionButton' onClick={getAnswer} style={ {'backgroundColor': 'green'} } href='/null' download='' >
          <h2><i className="fas fa-cloud-download-alt"></i> DOWNLOAD</h2>
        </a>
      </div>

    </div>
  );
}

ReactDOM.render(<SquareImageMaker />, document.getElementById('root'));
