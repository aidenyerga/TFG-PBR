/* IMAGE-SAVER
*  This file contains the code that takes a rendered frame and saves it as an image.
*  -----------------------------------
*  Este fichero contiene el código para tomar un fotograma renderizado y guardarlo como una imagen.
*/

var downloadType = "image/octet-stream";

var saveFile = function (strData, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        document.body.appendChild(link);
        link.download = filename;
        link.href = strData;
        link.click();
        document.body.removeChild(link);
    } else {
        location.replace(uri);
    }
}

var imageSaver = new function(){
    this.saveAsImage = function() {
        try {
            var type = "image/jpeg";
            var frame = renderer.domElement.toDataURL(type);
            saveFile(frame.replace(type, downloadType), "scene.jpg");
        } catch (e) {
            console.log(e);
            return;
        }
    };
};