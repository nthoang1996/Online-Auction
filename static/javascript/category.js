function showImage(source) {
    $('#img-container').attr("src", source);
}
// document.getElementById("myStar").addEventListener ("click", addtoFav, false);

function addtoFav(id) {
    alert(id);
    console.log(id);
}
$('.my-star').click(function(event) {
    event.preventDefault();
   var id = this.id;
    $.ajax({
        global: false,
        type: 'POST',
        url: '/fav',
        dataType: 'html',
        data: {
            id
           
          
        },
        success: function (result) {
            console.log(result);
        },
        error: function (request, status, error) {
            serviceError();
        }
    });
});