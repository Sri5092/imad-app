console.log('Loaded!');
var element = document.getElementById('main');
element.innerHTML = 'New Value';

var img = document.getElementById('img1');
img.onclick = function(){
    img.Style.marginLeft = '200px';
}