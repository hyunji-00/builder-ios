matrixMobile.define("matrix-mobile-plugin-camera.camera", function(require, exports, module) {
var argscheck = require('matrixMobile/argscheck'),
    exec = require('matrixMobile/exec'),
    Camera = require('./Camera');
    // XXX: commented out
    //CameraPopoverHandle = require('./CameraPopoverHandle');

/** 
 * @namespace navigator
 */

/**
 * @exports camera
 */
var cameraExport = {};

// Tack on the Camera Constants to the base camera plugin.
for (var key in Camera) {
    cameraExport[key] = Camera[key];
}

/**
 * Callback function that provides an error message.
 * @callback module:camera.onError
 * @param {string} message - The message is provided by the device's native code.
 */

/**
 * Callback function that provides the image data.
 * @callback module:camera.onSuccess
 * @param {string} imageData - Base64 encoding of the image data, _or_ the image file URI, depending on [`cameraOptions`]{@link module:camera.CameraOptions} in effect.
 * @example
 * // Show image
 * //
 * function cameraCallback(imageData) {
 *    var image = document.getElementById('myImage');
 *    image.src = "data:image/jpeg;base64," + imageData;
 * }
 */

/**
 * Optional parameters to customize the camera settings.
 * * [Quirks](#CameraOptions-quirks)
 * @typedef module:camera.CameraOptions
 * @type {Object}
 * @property {number} [quality=50] - Quality of the saved image, expressed as a range of 0-100, where 100 is typically full resolution with no loss from file compression. (Note that information about the camera's resolution is unavailable.)
 * @property {module:Camera.DestinationType} [destinationType=FILE_URI] - Choose the format of the return value.
 * @property {module:Camera.PictureSourceType} [sourceType=CAMERA] - Set the source of the picture.
 * @property {Boolean} [allowEdit=true] - Allow simple editing of image before selection.
 * @property {module:Camera.EncodingType} [encodingType=JPEG] - Choose the  returned image file's encoding.
 * @property {number} [targetWidth] - Width in pixels to scale image. Must be used with `targetHeight`. Aspect ratio remains constant.
 * @property {number} [targetHeight] - Height in pixels to scale image. Must be used with `targetWidth`. Aspect ratio remains constant.
 * @property {module:Camera.MediaType} [mediaType=PICTURE] - Set the type of media to select from.  Only works when `PictureSourceType` is `PHOTOLIBRARY` or `SAVEDPHOTOALBUM`.
 * @property {Boolean} [correctOrientation] - Rotate the image to correct for the orientation of the device during capture.
 * @property {Boolean} [saveToPhotoAlbum] - Save the image to the photo album on the device after capture.
 * @property {module:CameraPopoverOptions} [popoverOptions] - iOS-only options that specify popover location in iPad.
 * @property {module:Camera.Direction} [cameraDirection=BACK] - Choose the camera to use (front- or back-facing).
 */

/**
 * @description Takes a photo using the camera, or retrieves a photo from the device's
 * image gallery.  The image is passed to the success callback as a
 * base64-encoded `String`, or as the URI for the image file.  
 * 
 * The `camera.getPicture` function opens the device's default camera
 * application that allows users to snap pictures by default - this behavior occurs,
 * when `Camera.sourceType` equals [`Camera.PictureSourceType.CAMERA`]{@link module:Camera.PictureSourceType}.  
 * Once the user snaps the photo, the camera application closes and the application is restored.
 * 
 * If `Camera.sourceType` is `Camera.PictureSourceType.PHOTOLIBRARY` or
 * `Camera.PictureSourceType.SAVEDPHOTOALBUM`, then a dialog displays
 * that allows users to select an existing image.  The
 * `camera.getPicture` function returns a [`CameraPopoverHandle`]{@link module:CameraPopoverHandle} object,
 * which can be used to reposition the image selection dialog, for
 * example, when the device orientation changes.
 * 
 * The return value is sent to the [`cameraSuccess`]{@link module:camera.onSuccess} callback function, in
 * one of the following formats, depending on the specified
 * `cameraOptions`:
 * 
 * - A `String` containing the base64-encoded photo image.
 * 
 * - A `String` representing the image file location on local storage (default).
 * 
 * You can do whatever you want with the encoded image or URI, for
 * example:
 * 
 * - Render the image in an `<img>` tag, as in the example below
 * 
 * - Save the data locally (`LocalStorage`, [Lawnchair](http://brianleroux.github.com/lawnchair/), etc.)
 * 
 * - Post the data to a remote server
 * 
 * __NOTE__: Photo resolution on newer devices is quite good. Photos
 * selected from the device's gallery are not downscaled to a lower
 * quality, even if a `quality` parameter is specified.  To avoid common
 * memory problems, set `Camera.destinationType` to `FILE_URI` rather
 * than `DATA_URL`.
 *
 * __Supported Platforms__
 *
 * ![](doc/img/android-success.png) ![](doc/img/blackberry-success.png) ![](doc/img/browser-success.png) ![](doc/img/firefox-success.png) ![](doc/img/fireos-success.png) ![](doc/img/ios-success.png) ![](doc/img/windows-success.png) ![](doc/img/wp8-success.png) ![](doc/img/ubuntu-success.png)
 *
 * * [More examples](#camera-getPicture-examples)
 *
 * * [Quirks](#camera-getPicture-quirks)
 * @example
 * navigator.camera.getPicture(cameraSuccess, cameraError, cameraOptions);
 * @param {module:camera.onSuccess} successCallback
 * @param {module:camera.onError} errorCallback
 * @param {module:camera.CameraOptions} options CameraOptions
 */
cameraExport.getPicture = function(callback, options) {
    argscheck.checkArgs('FO', 'Camera.getPicture', arguments);
    options = options || {};
    var getValue = argscheck.getValue;

    var quality = getValue(options.quality, 50);
    var destinationType = getValue(options.destinationType, Camera.DestinationType.FILE_URI);
    var sourceType = getValue(options.sourceType, Camera.PictureSourceType.CAMERA);
    var targetWidth = getValue(options.targetWidth, -1);
    var targetHeight = getValue(options.targetHeight, -1);
    var encodingType = getValue(options.encodingType, Camera.EncodingType.JPEG);
    var mediaType = getValue(options.mediaType, Camera.MediaType.PICTURE);
    var allowEdit = !!options.allowEdit;
    var correctOrientation = !!options.correctOrientation;
    var saveToPhotoAlbum = !!options.saveToPhotoAlbum;
    var popoverOptions = getValue(options.popoverOptions, null);
    var cameraDirection = getValue(options.cameraDirection, Camera.Direction.BACK);
    var useGeoLocation = !!options.useGeolocation;
    
    var args = [quality, destinationType, sourceType, targetWidth, targetHeight, encodingType,
                mediaType, allowEdit, correctOrientation, saveToPhotoAlbum, popoverOptions, cameraDirection, useGeoLocation];

    exec(callback, "MatrixMobileCameraPlugin", "takePicture", args);
    // XXX: commented out
    //return new CameraPopoverHandle();
};

/**
 * Removes intermediate image files that are kept in temporary storage
 * after calling [`camera.getPicture`]{@link module:camera.getPicture}. Applies only when the value of
 * `Camera.sourceType` equals `Camera.PictureSourceType.CAMERA` and the
 * `Camera.destinationType` equals `Camera.DestinationType.FILE_URI`.
 *
 * __Supported Platforms__
 *
 * ![](doc/img/android-fail.png) ![](doc/img/blackberry-fail.png) ![](doc/img/browser-fail.png) ![](doc/img/firefox-fail.png) ![](doc/img/fireos-fail.png) ![](doc/img/ios-success.png) ![](doc/img/windows-fail.png) ![](doc/img/wp8-fail.png) ![](doc/img/ubuntu-fail.png) 
 *
 * @example
 * navigator.camera.cleanup(onSuccess, onFail);
 * 
 * function onSuccess() {
 *     console.log("Camera cleanup success.")
 * }
 *
 * function onFail(message) {
 *     alert('Failed because: ' + message);
 * }
 */
cameraExport.cleanup = function(callback) {
    exec(callback, "MatrixMobileCameraPlugin", "cleanup", []);
};

module.exports = cameraExport;

});