import { Eliza } from './eliza';

let e: Eliza;
window.onload = function() {
     e = new Eliza(null);
     let inputEl: HTMLInputElement = <HTMLInputElement>document.getElementById('input');
     let respEl: HTMLInputElement = <HTMLInputElement>document.getElementById('response');
     let submit: HTMLElement = document.getElementById('submit');
     submit.addEventListener('click', function() {
         getResponse(inputEl, respEl);
     });
     inputEl.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13) {
            getResponse(inputEl, respEl);
        }
    });
}

function getResponse(inputEl, respEl) {
    let input: string = inputEl.value;
    let resp: string = e.getResponse(input);
    respEl.value = respEl.value + '\nyou: ' + input + '\neliza: ' + resp + '\n';
    inputEl.value = '';
}