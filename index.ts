import { Eliza } from './eliza';

let e: Eliza;
window.onload = function() {
     e = new Eliza(null);
     let inputEl: HTMLInputElement = <HTMLInputElement>document.getElementById('input');
     let respEl: HTMLInputElement = <HTMLInputElement>document.getElementById('response');
     let submit: HTMLElement = document.getElementById('submit');
     submit.addEventListener('click', function() {
         let input: string = inputEl.value;
         let resp: string = e.getResponse(input);
         respEl.value = respEl.value + '\nyou: ' + input + '\neliza: ' + resp + '\n'; 
     });
}