$(document).ready(function($) {
var input = document.querySelector('input[type=file]');
var fileType = "";
var fileName = "";
var loading = false;
var lInterval;
var finishedBlobs = [];
var fileCount = 0;
var currentFile = 0;

// start
$("#go").on('click', function(){
    if(!loading){
        fileCount = input.files.length;
        changeFile(0);
        startLoading();
    }
});

// loaders
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

//main
// reads file input
function changeFile(index) {
  console.log(input.files);
  currentFile = index;
  var file = input.files[index];
  applyUiUpdates(file);
  var reader = new FileReader();
  reader.addEventListener('load', readFile);
  reader.readAsDataURL(file);
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
      console.log("Current File: " + currentFile);
      console.log("Current Size: " + currentSize );
      console.log("Desired Size: " + desiredSize);
      $("#currentAt").text(currentSize);

      if(currentSize <= desiredSize || currentSize <= 1000000){
            console.log(fileCount);
            // alert('Close as I can be!');

            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = currentWidth;
            canvas.height = imgHolder.height;

            ctx.drawImage(img, 0, 0);

            ctx.canvas.toBlob((blob) => {
                finishedBlobs.push({blob: blob, fileName: fileName + "-" + $("#size").val() + "(mb).jpg"});
                if(currentFile + 1 < fileCount){
                  changeFile(currentFile + 1);
                } else {
                  var zip = new JSZip();
                  for(var i = 0; i < finishedBlobs.length; i++){
                    zip.file(finishedBlobs[i].fileName, finishedBlobs[i].blob);
                  }

                  zip.generateAsync({type: "blob"}).then(function(content){
                      saveAs(content, "filez.zip");
                  })


                  stopLoading();
                  // alert("I have finished all of the files");
                  console.log(finishedBlobs);
                  }

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

//should do the chunk in half thing
// function readFileV2(event) {
//   var currentWidth;
//   var currentSize = event.total;
//   var desiredSize = (Number($("#size").val()) * 1e6) - 1000000;

//   var img = new Image();
//   img.src = event.target.result;

//   // create image holder to read current size
//   var imgHolder = document.createElement('img');
//   imgHolder.src = event.target.result;

//   imgHolder.onload = function() {
    
//   }

// }


function applyUiUpdates(file) {
    fileType = file.type;
    fileName = file.name;
    $("#type").text(fileType);
    $("#name").text(fileName);
    $("#desired").text($("#size").val() + "(mb)");
}

});