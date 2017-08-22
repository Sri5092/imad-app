console.log('Loaded!');
var element = document.getElementById('main');
element.innerHTML = 'New Value';

var img = document.getElementById('madi');
var marginleft = 0;
function moveright(){
    marginleft = marginleft + 5;
    img.style.marginLeft = marginleft + 'px';
}
img.onclick = function(){
  var interval = setinterval(moveright,'50');
 
};