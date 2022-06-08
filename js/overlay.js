window.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#button').addEventListener('click', function(){
        document.querySelector('#overlay').classList.toggle('overlay-active')
    })

    document.querySelector('#close').addEventListener('click', function(){
        document.querySelector('#overlay').classList.toggle('overlay-no_active')
    })
});





