// Paragraph editor 

function showPara() {
    let P3 = document.getElementById('para03')
    let P4 = document.getElementById('para04')
    let P5 = document.getElementById('para05')
    let PB = document.getElementById('praButton')
    if (P3.style.display == 'none') {
        P3.style.display = 'block'
    } else if (P4.style.display == 'none') {
        P4.style.display = 'block'
    } else {
        P5.style.display = 'block'
        PB.style.display = 'none'
    }

}

function showButton() {
    let B1 = document.getElementById('btn01')
    let B2 = document.getElementById('btn02')
    let BB = document.getElementById('btnButton')
    if (B1.style.display == 'none') {
        B1.style.display = 'block'
    } else {
        B2.style.display = 'block'
        BB.style.display = 'none'
    }
}

function closepara(id) {
    let PB = document.getElementById('praButton')
    document.getElementById(id).style.display = 'none'
    PB.style.display = 'block'
}
function closebtn(id) {
    let BB = document.getElementById('btnButton')
    document.getElementById(id).style.display = 'none'
    BB.style.display = 'block'
}

// Slider

function closeModel(id) {

    document.getElementById(id).style.display = 'none'
}

function chooseSlider() {
    document.getElementById('slider-file').click();
}

function viewImage(event) {
    var image = document.getElementById('profile-image')
    var alertDiv = document.getElementById('alert-div')
    var alertContent = document.getElementById('alert-content')
    var alertAudio = document.getElementById('alert-audio')
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const maxFileSize = 3145728; // 3 MB



        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            console.log(event)
            if (file.size > maxFileSize) {
                alertContent.innerHTML = "Image file is too big. Please choose smaller than 3 MB"
                alertDiv.style.display = "flex"
                alertAudio.src = "/audio/alert/01.mp3"
                setTimeout(hideAlert, 3000)
            } else {

                image.src = URL.createObjectURL(event.target.files[0])


            }
        };
    }
}

// call

