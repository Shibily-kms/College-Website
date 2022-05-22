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

function chooseImage() {
    document.getElementById('upload-file').click();
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

        const maxFileSize = 1048576; // 1 MB



        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {

            if (file.size > maxFileSize) {
                alertContent.innerHTML = "Image file is too big. Please choose smaller than 1 MB"
                alertDiv.style.display = "flex"
                alertAudio.src = "/audio/alert/01.mp3"
                setTimeout(hideAlert, 3000)
            } else {

                image.src = URL.createObjectURL(event.target.files[0])
                


            }
        };
    }
}

// Open and Delete Profile in admin page



function openmodel(id) {
    let profileDiv = document.getElementById('profile-Div')
    let profile = document.getElementById('profile-model')
    let header = document.getElementById('model-header')
    let image = document.getElementById('profile-image')
    let indexInput = document.getElementById('index')
    let nameInput = document.getElementById('fullname')
    let positionInput = document.getElementById('position')
    let addressInput = document.getElementById('address')
    let mobileInput = document.getElementById('mobile')
    let idInput = document.getElementById('slider-id')

    profileDiv.style.display = "flex"
    profile.style.display = "block"
    if (id == 'new') {
        header.innerHTML = "Create profile"
        indexInput.value = ''
        idInput.value = ''
        nameInput.value = ''
        positionInput.value = ''
        addressInput.value = ''
        mobileInput.value = ''
        document.getElementById('slider-file').value = ''
        image.src = '/images/background/1.jpg'
    } else {
        let index = document.getElementById('index' + id).innerHTML
        let fullname = document.getElementById('fullname' + id).innerHTML
        let position = document.getElementById('position' + id).innerHTML
        let address = document.getElementById('address' + id).innerHTML
        let mobile = document.getElementById('mobile' + id).innerHTML
        header.innerHTML = "Update profile"
        image.src = '/images/profiles/' + id + '.jpg'
        indexInput.value = index
        nameInput.value = fullname
        addressInput.value = address
        positionInput.value = position
        mobileInput.value = mobile
        idInput.value = id
    }
}


function deleteProfile(Id) {

    let div = document.getElementById('profileDiv' + Id)
    let Icon = document.getElementById('removeIcon' + Id)
    let confirmDiv = document.getElementById('confirm-box-div')
    let confirmTitle = document.getElementById('confirm-title')
    let yesButton = document.getElementById('confirmYes')
    let NoButton = document.getElementById('confirmNo')
    let title = "Do you want to delete this profile ?"

    Icon.className = 'bi bi-emoji-frown'
    confirmDiv.style.display = 'flex';
    confirmTitle.innerHTML = title

    yesButton.addEventListener("click", () => {
        $.ajax({
            url: '/admin/delete-profile',
            data: {
                Id
            },
            method: 'post',
            success: (response) => {
                div.style.display = 'none'
                confirmDiv.style.display = 'none';

            }
        })
    });
    NoButton.addEventListener("click", () => {
        confirmDiv.style.display = 'none';
        Icon.className = 'i bi-trash3'
    });
    
    
}






