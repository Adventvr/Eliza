import { Eliza } from './eliza';
let e;
window.onload = function () {
    e = new Eliza(null);
    let inputEl = document.getElementById('input');
    let respEl = document.getElementById('response');
    let submit = document.getElementById('submit');
    submit.addEventListener('click', function () {
        getResponse(inputEl, respEl);
    });
    inputEl.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode == 13) {
            getResponse(inputEl, respEl);
        }
    });
};
function getResponse(inputEl, respEl) {
    let input = inputEl.value;
    let resp = e.getResponse(input);
    respEl.value = respEl.value + '\nyou: ' + input + '\neliza: ' + resp + '\n';
    inputEl.value = '';
}
