import "./css/index.css"
import IMask from "imask";

const ccBgColor01 = document.querySelector('.cc-bg g > g:nth-child(1) path');
const ccBgColor02 = document.querySelector('.cc-bg g > g:nth-child(2) path');
const ccLogo = document.querySelector('.cc-logo > span:nth-child(2) img');

function setCardType(type) {
  const colors = {
    visa: ['#2D57F2', '#436D99'],
    mastercard: ['#DF6F29', '#C69347'],
    default: ['black', 'gray'],
  };

  ccBgColor01.setAttribute('fill', colors[type][0]);
  ccBgColor02.setAttribute('fill', colors[type][1]);
  ccLogo.setAttribute('src', `/cc-${type}.svg`);
}

globalThis.setCardType = setCardType;

const securityCode = document.querySelector('#security-code');
const securityCodeMasked = IMask(securityCode, { mask: '0000' });

const expirationDate = document.querySelector('#expiration-date');
const expirationDateMasked = IMask(expirationDate, {
  mask: 'MM{/}YY',
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    },
  },
});

const visaRegEx = /^4\d{0,15}/;
const masterRegEx = /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/;

const cardNumber = document.querySelector('#card-number');
const cardNumberMask = IMask(cardNumber, {
  mask: [
    {
      mask: '0000 0000 0000 0000',
      regex: visaRegEx,
      cardType: 'visa',
    },
    {
      mask: '0000 0000 0000 0000',
      regex: masterRegEx,
      cardType: 'mastercard',
    },
    {
      mask: '0000 0000 0000 0000',
      cardType: 'default',
    }
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (appended + dynamicMasked.value).replace(/\D/g, '');
    return dynamicMasked.compiledMasks.find(m => number.match(m.regex));
  }
});

const addButton = document.querySelector('#add-card');
addButton.addEventListener('click', () => {
  // adicionar função de adição do cartão
});

const cardHolder = document.querySelector('#card-holder');
cardHolder.addEventListener('input', () => {
  const ccHolder = document.querySelector('.cc-holder .value');
  ccHolder.innerText = cardHolder.value.length ? cardHolder.value : 'fulano da silva';
});

document.querySelector('form').addEventListener('submit', e => e.preventDefault());

cardNumberMask.on('accept', () => {
  const ccCardNumber = document.querySelector('.cc-number');
  ccCardNumber.innerText = cardNumberMask.value.length ? cardNumberMask.value : '1234 5678 9012 3456';
  setCardType(cardNumberMask.masked.currentMask.cardType);
});

securityCodeMasked.on('accept', () => {
  const ccSecurity = document.querySelector('.cc-security .value');
  ccSecurity.innerText = securityCodeMasked.value.length ? securityCodeMasked.value : '123';
});

expirationDateMasked.on('accept', () => {
  const ccExpiration = document.querySelector('.cc-expiration .value');
  ccExpiration.innerText = expirationDateMasked.value.length ? expirationDateMasked.value : '02/32';
});
