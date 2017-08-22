console.log('Loaded!');
var element = document.getElementById('main');
element.innerHTML = 'New Value';

var img = document.getElementById('madi');
img.onclick = function(){
    img.style.marginLeft = '200px';
};