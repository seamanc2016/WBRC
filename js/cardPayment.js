//Used in accountSetup.html
//Code copied/modified from "Credit Card Payment Form" by Adam Quinlan
//Original source: https://codepen.io/quinlo/pen/YONMEa


window.onload = function () {

    //const name = document.getElementById('name');
    const cardnumber = document.getElementById('cardnumber');
    const expirationdate = document.getElementById('expirationdate');
    const securitycode = document.getElementById('securitycode');
    //const output = document.getElementById('output');
    //const ccicon = document.getElementById('ccicon');
    //const ccsingle = document.getElementById('ccsingle');
    const generatecard = document.getElementById('generatecard');
    
    
    let cctype = null;
    
    //Mask the Credit Card Number Input
    var cardnumber_mask = new IMask(cardnumber, {
        mask: [
            {
                mask: '0000 000000 00000',
                regex: '^3[47]\\d{0,13}',
                cardtype: 'american express'
            },
            {
                mask: '0000 0000 0000 0000',
                regex: '^(?:6011|65\\d{0,2}|64[4-9]\\d?)\\d{0,12}',
                cardtype: 'discover'
            },
            {
                mask: '0000 000000 0000',
                regex: '^3(?:0([0-5]|9)|[689]\\d?)\\d{0,11}',
                cardtype: 'diners'
            },
            {
                mask: '0000 0000 0000 0000',
                regex: '^(5[1-5]\\d{0,2}|22[2-9]\\d{0,1}|2[3-7]\\d{0,2})\\d{0,12}',
                cardtype: 'mastercard'
            },
            // {
            //     mask: '0000-0000-0000-0000',
            //     regex: '^(5019|4175|4571)\\d{0,12}',
            //     cardtype: 'dankort'
            // },
            // {
            //     mask: '0000-0000-0000-0000',
            //     regex: '^63[7-9]\\d{0,13}',
            //     cardtype: 'instapayment'
            // },
            {
                mask: '0000 000000 00000',
                regex: '^(?:2131|1800)\\d{0,11}',
                cardtype: 'jcb15'
            },
            {
                mask: '0000 0000 0000 0000',
                regex: '^(?:35\\d{0,2})\\d{0,12}',
                cardtype: 'jcb'
            },
            {
                mask: '0000 0000 0000 0000',
                regex: '^(?:5[0678]\\d{0,2}|6304|67\\d{0,2})\\d{0,12}',
                cardtype: 'maestro'
            },
            // {
            //     mask: '0000-0000-0000-0000',
            //     regex: '^220[0-4]\\d{0,12}',
            //     cardtype: 'mir'
            // },
            {
                mask: '0000 0000 0000 0000',
                regex: '^4\\d{0,15}',
                cardtype: 'visa'
            },
            {
                mask: '0000 0000 0000 0000',
                regex: '^62\\d{0,14}',
                cardtype: 'unionpay'
            },
            {
                mask: '0000 0000 0000 0000',
                cardtype: 'Unknown'
            }
        ],
        dispatch: function (appended, dynamicMasked) {
            var number = (dynamicMasked.value + appended).replace(/\D/g, '');
    
            for (var i = 0; i < dynamicMasked.compiledMasks.length; i++) {
                let re = new RegExp(dynamicMasked.compiledMasks[i].regex);
                if (number.match(re) != null) {
                    return dynamicMasked.compiledMasks[i];
                }
            }
        }
    });
    
    //Mask the Expiration Date
    var expirationdate_mask = new IMask(expirationdate, {
        mask: 'MM{/}YY',
        groups: {
            YY: new IMask.MaskedPattern.Group.Range([0, 99]),
            MM: new IMask.MaskedPattern.Group.Range([1, 12]),
        }
    });
    
    //Mask the security code
    var securitycode_mask = new IMask(securitycode, {
        mask: '000',
    });
    
    
    
    //define the color swap function
    /*
    const swapColor = function (basecolor) {
        document.querySelectorAll('.lightcolor')
            .forEach(function (input) {
                input.setAttribute('class', '');
                input.setAttribute('class', 'lightcolor ' + basecolor);
            });
        document.querySelectorAll('.darkcolor')
            .forEach(function (input) {
                input.setAttribute('class', '');
                input.setAttribute('class', 'darkcolor ' + basecolor + 'dark');
            });
    };
    */

    //pop in the appropriate card icon when detected
    /*
    cardnumber_mask.on("accept", function () {
        console.log(cardnumber_mask.masked.currentMask.cardtype);
        switch (cardnumber_mask.masked.currentMask.cardtype) {
            case 'american express':
                ccicon.innerHTML = amex;
                ccsingle.innerHTML = amex_single;
                swapColor('green');
                break;
            case 'visa':
                ccicon.innerHTML = visa;
                ccsingle.innerHTML = visa_single;
                swapColor('lime');
                break;
            case 'diners':
                ccicon.innerHTML = diners;
                ccsingle.innerHTML = diners_single;
                swapColor('orange');
                break;
            case 'discover':
                ccicon.innerHTML = discover;
                ccsingle.innerHTML = discover_single;
                swapColor('purple');
                break;
            case ('jcb' || 'jcb15'):
                ccicon.innerHTML = jcb;
                ccsingle.innerHTML = jcb_single;
                swapColor('red');
                break;
            case 'maestro':
                ccicon.innerHTML = maestro;
                ccsingle.innerHTML = maestro_single;
                swapColor('yellow');
                break;
            case 'mastercard':
                ccicon.innerHTML = mastercard;
                ccsingle.innerHTML = mastercard_single;
                swapColor('lightblue');
    
                break;
            case 'unionpay':
                ccicon.innerHTML = unionpay;
                ccsingle.innerHTML = unionpay_single;
                swapColor('cyan');
                break;
            default:
                ccicon.innerHTML = '';
                ccsingle.innerHTML = '';
                swapColor('grey');
                break;
        }
      
    });
    */
    
    
    //Generate random card number from list of known test numbers
    const randomCard = function () {
        let testCardNumbers = [
            //Visa
            '4000056655665556',
            '4276420620071489',
            '4206141670465125',
            '4645892580811522',
            '4357049758739393',
            
            //Mastercard
            '5200828282828210',
            '5285457101637178',
            '5539503637710544',
            '5598250825372533',
            '5397087655688916',

            //Maestro
            '5031816867484215,',
            '5634750003268730',
            '5750630152756701',
            '5821471475436225',
            '6111183582170376',

            //American Express
            '371449635398431',
            '343446449997122',
            '349950901476149',
            '346832226409315',
            '372911873498065',

            //Discover
            '6011000990139424',
            '6011208091664618',
            '6011130637975409',
            '6011878890713434',
            '6011922566121793'
        ];


        //Random card number
        let numberIndex = Math.floor(Math.random() * testCardNumbers.length);
        cardnumber_mask.unmaskedValue = testCardNumbers[numberIndex];

        //Random exp date
        let expMonth = Math.floor(Math.random() * 12)
        if(expMonth == 0)
            expMonth++;

        if(expMonth < 10)
            expMonth = '0' + parseInt(expMonth);

        let testYears = ['23', '24', '25', '26','27']     
        let yearIndex = Math.floor(Math.random() * testYears.length)
        expirationdate.value = `${expMonth}` + '/' + testYears[yearIndex];

        //Random CCV
        let randomCVV = Math.floor(Math.random() * 999);
        if(randomCVV < 100)
            randomCVV += 100;

        securitycode.value = randomCVV;

 
    }
    
    generatecard.addEventListener('click', function () {
        randomCard();
    });
    
    
};