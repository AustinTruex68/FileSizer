$(document).ready(function($) {
var input = document.querySelector('input[type=file]');
var fileType = "";
var fileName = "";
var loading = false;
var lInterval;

$("#go").on('click', function(){
    console.log("Go!");
    if(!loading){
        changeFile();
        startLoading();
    }
});

function buildReader(file) {
    const reader = new FileReader();
    reader.readAsDataURL()
}

function readFile(event) {
  var currentWidth;
  var currentSize = event.total;
  var desiredSize = (Number($("#size").val()) * 1e6) - 1000000;

  var img = new Image();
  img.src = event.target.result;


  var imgHolder = document.createElement('img');
  imgHolder.src = event.target.result;
  imgHolder.onload = function(){

      currentWidth = imgHolder.width;

      console.log("Current Size: " + currentSize );
      console.log("Desired Size: " + desiredSize);
      $("#currentAt").text(currentSize);

      if(currentSize <= desiredSize || currentSize <= 1000000){
            stopLoading();
            alert('Close as I can be!');

            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = currentWidth;
            canvas.height = imgHolder.height;

            ctx.drawImage(img, 0, 0);

            ctx.canvas.toBlob((blob) => {
                saveAs(blob, fileName)
            });

      } else {
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          var newWidth = currentWidth - 150;
          var scaleFactor = newWidth/currentWidth;
          canvas.width = newWidth;
          canvas.height = img.height * scaleFactor;
          ctx.drawImage(img, 0, 0, newWidth, img.height * scaleFactor);


          var newFile = ctx.canvas.toBlob((blob) => {

              const file = new File([blob], 'next', {
                  type: fileType,
                  lastModified: Date.now()
              });

              var reader = new FileReader();
              reader.addEventListener('load', readFile);
              reader.readAsDataURL(file)


          }, fileType, 1);

      }

  }

}

// reads file input
function changeFile() {
  var file = input.files[0];

  applyUiUpdates(file);

  var reader = new FileReader();
  reader.addEventListener('load', readFile);
  reader.readAsDataURL(file);
}


function applyUiUpdates(file) {
    fileType = file.type;
    fileName = file.name;
    $("#type").text(fileType);
    $("#name").text(fileName);
    $("#desired").text($("#size").val() + "(mb)");
}

function startLoading() {
    loading = true;
    $("#loader").css('display', 'inline');
    var dCount = 0;
    lInterval = setInterval(function(){
        dCount++

        if(dCount >= 4)
            dCount = 0;

        $("#loader").text("Loading" + ".".repeat(dCount))
    }, 300);
}

function stopLoading() {
    loading = false;
    $("#loader").css('display', 'none');
    clearInterval(lInterval);
    $("#currentAt").text("");
}



// input.addEventListener('change', changeFile);

});