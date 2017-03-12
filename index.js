import { Eliza } from './eliza';
let e;
window.onload = function () {
    e = new Eliza(null);
    let inputEl = document.getElementById('input');
    let respEl = document.getElementById('response');
    let submit = document.getElementById('submit');
    submit.addEventListener('click', function () {
        let input = inputEl.value;
        let resp = e.getResponse(input);
        respEl.value = respEl.value + '\nyou: ' + input + '\neliza: ' + resp + '\n';
    });
};
