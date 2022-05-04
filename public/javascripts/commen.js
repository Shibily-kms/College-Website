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

// 

function ParaHeader(){
    alert()
}