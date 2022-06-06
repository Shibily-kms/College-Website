function hasNetWork(online) {
    const element = document.querySelector(".network");
   

    if (online) {
        element.classList.remove("offline")
        element.classList.add("online");

        element.innerHTML = `<i class="bi bi-record-fill"></i> Online`
        $.ajax({
            url: '/admin/change-admin-network',
            data: {
                
            },
            method: 'post',
            success: () => {
            }
        })
        
    } else {

        element.classList.remove("offline")
        element.classList.add("offline");
        element.innerHTML = `<i class="bi bi-record-fill"></i> Offline`
        
    }

}

window.addEventListener("load", () => {
    hasNetWork(navigator.onLine);

    window.addEventListener("online", () => {
        hasNetWork(true)
    })
    window.addEventListener("offline", () => {
        hasNetWork(false)
    })
})