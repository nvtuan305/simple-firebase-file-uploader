var file;

function selectFile() {
    var fileInput = document.getElementById("input-select-file");
    var message = "";
    if ('files' in fileInput) {
        var files = fileInput.files;
        if (files.length == 0) {
            message = "No file choosen!";
        } else {
            file = files[0];
            if ('name' in file) {
                message += "- File name: " + file.name + "<br>";
            }
            if ('size' in file) {
                message += "- File size: " + file.size + " bytes <br>";
            }
            if (fileInput.value) {
                message += "- File path: " + fileInput.value;
            }
        }
    } else {
        message = fileInput.value == "" ? "No file choosen!" :
            "The files property is not supported by your browser!"
            + "<br>The path of the selected file: " + fileInput.value;
    }
    document.getElementById("file-info").innerHTML = message;
}

function upload() {
    if (!file) {
        alert("No file choosen!");
        return;
    }

    var storageRef = firebase.storage().ref();
    var uploadTask = storageRef.child('images/' + file.name).put(file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            document.getElementById("result").innerHTML =
                'Upload is ' + parseFloat(progress).toFixed(2) + '% done';
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED:
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING:
                    console.log('Upload is running');
                    break;
            }
        }, function (error) {
            document.getElementById("result").innerHTML = error;
        }, function () {
            var downloadURL = uploadTask.snapshot.downloadURL;
            document.getElementById("result").innerHTML = "View file";
            document.getElementById("result").href = downloadURL;
        });
}