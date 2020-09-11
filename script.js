let parent = document.querySelector('#parent');
let base_collection = []; // Holder of all bases
let numberline_collection = []; // Holder of all numberlines
let base_selection = document.querySelector('#base_selection');
let base_create = document.querySelector('#base_create');

// Holder of base

class NumberBase {
    constructor(base, number) {
        this.base = base;
        this.counter_ten = number;
        this.counter_base = this.counter_ten.toString(this.base);
    }
    add(number) {
        this.counter_ten += number;
        this.tenToBase();
    }
    subtract(number) {
        if (this.counter_ten > 0) {
            this.counter_ten -= number;
            this.tenToBase();
        }
    }
    tenToBase() {
        this.counter_base = (this.counter_ten).toString(this.base)
    }
}

// Holder of how a sigle numberline should behave
class NumberGraphics {
    constructor(parent, base, index) {
        this.parentDiv = parent;
        this.index = index;
        this.base = base;
        this.isActive = false;
        this.selected = 0;
        this.numbersDiv = document.createElement('div');
        this.numbersDiv.className = "numbers";

        this.create();

    }
    create() {
        for (let k = 0; k < this.base.base; k++) {
            let child = document.createElement('div');
            child.innerHTML = k.toString(this.base.base);
            child.className = 'number';
            this.numbersDiv.appendChild(child);
        }
        this.parentDiv.appendChild(this.numbersDiv);
    }
    select(number) {
        let allNumbers = this.numbersDiv.querySelectorAll('.number');

        allNumbers.forEach((thing) => {
            thing.classList.remove('selected');
        })

        allNumbers[number].classList.add('selected');
        this.numbersDiv.style.opacity = 1;

        anime({
            targets: this.numbersDiv,
            translateY: `${(-number * 52) + 200}`,
            easing: 'easeInOutQuad',
            duration: 500

        });
    }
    unselect() {
        let allNumbers = this.numbersDiv.querySelectorAll('.number');
        allNumbers.forEach((thing) => {
            thing.classList.remove('selected');
            this.numbersDiv.style.opacity = 0;
        })
        anime({
            targets: this.numbersDiv,
            translateY: `${(0) + 210}`,
            easing: 'easeInOutQuad',
            duration: 500

        });
    }
}

// Holder of how the graphics of a single base should behave
class NumberLine {
    constructor(parent, base, explanation) {
        this.parent = parent;
        this.numberlines = [];
        this.base = base;
        this.explanation = explanation;


        for (let i = 0; i < 5; i++) {
            this.numberlines[i] = new NumberGraphics(this.parent, this.base, 4 - i);
        }

        this.explanation.innerHTML = this.base.counter_base;
    }
    displayNumber() {
        let the_pick = this.base.counter_base;
        the_pick = the_pick.split("").reverse();

        this.numberlines.forEach(item => {
            item.isActive = false;
        })

        the_pick.forEach((item, k) => {
            this.numberlines[4 - k].select(parseInt(item, this.base.base));
            this.numberlines[4 - k].isActive = true;
        })

        this.numberlines.forEach(item => {
            if (!item.isActive) {
                item.select(0);
                item.unselect();
            }
        })

        let currentNumber = this.base.counter_base;
        let splitcurrentNumber = currentNumber.split('')
        console.log(splitcurrentNumber);
        let finaloutput = "(";
        for (let i = 0; i < splitcurrentNumber.length; i++) {
            if (i === 0) {
                finaloutput += this.base.base + "^" + (splitcurrentNumber.length - i - 1) + "\\cdot" + "\\\htmlClass{coefficiants}{" + parseInt(splitcurrentNumber[i], this.base.base) + "}";
                console.log(splitcurrentNumber.length - i)
            } else {
                finaloutput += "+" + this.base.base + "^" + (splitcurrentNumber.length - i - 1) + "\\cdot" + "\\\htmlClass{coefficiants}{" + parseInt(splitcurrentNumber[i], this.base.base) + "}";
                console.log(splitcurrentNumber.length - i)
            }
        }
        finaloutput += ") _{\\tiny{bas 10}}"
        finaloutput += `= ${this.base.counter_ten}`;
        finaloutput += ' _{\\tiny{bas 10}}'
        console.log(finaloutput);
        this.explanation.innerHTML = finaloutput;

        katex.render(`${finaloutput}`, this.explanation, {
            throwOnError: false,
            trust: true,
            strict: false
        });
    }

}

additionprocess = function () {
    base_collection.forEach((item) => {
        item.add(1);
    })
    numberline_collection.forEach((item) => {
        item.displayNumber();
    })
}

function subtractionprocess() {
    base_collection.forEach((item) => {
        item.subtract(1);
    })
    numberline_collection.forEach((item) => {
        item.displayNumber();
    })
}

plus.addEventListener('click', additionprocess);

document.addEventListener('keypress', (e) => {
    if (e.charCode === 43) {
        additionprocess();
    }
    if (e.charCode === 45) {
        subtractionprocess();
    }
})

minus.addEventListener('click', () => {
    subtractionprocess();
})

base_create.addEventListener('click', () => {

    // New number base
    let new_div = document.createElement('div');
    parent.appendChild(new_div);

    // create a numberline for each value
    let startvalue = 0;
    if (base_collection.length === 0) {
        startvalue = 0;
    } else {
        startvalue = base_collection[0].counter_ten;
    }

    // Create an explanation div
    let new_explanation = document.createElement('div');
    new_explanation.classList.add('expl');

    let new_base = new NumberBase(base_selection.value, startvalue);
    let new_base_numberline = new NumberLine(new_div, new_base, new_explanation)

    numberline_collection.push(new_base_numberline);
    base_collection.push(new_base);

    new_base_numberline.displayNumber();

    let numberHeader = document.createElement('div');
    numberHeader.classList.add('numberheader');
    numberHeader.innerHTML = `Bas ${base_selection.value}`;

    let showExpl = document.createElement('button');
    showExpl.innerHTML = "=";
    showExpl.classList.add('showExpl');
    numberHeader.appendChild(showExpl);
    new_div.appendChild(numberHeader);

    // Closebutton
    let close = document.createElement('button');
    close.innerHTML = "X";
    close.classList.add('close');
    numberHeader.appendChild(close);
    new_div.appendChild(numberHeader);

    // Förklaring
    new_div.appendChild(new_explanation);


    // ... when pressing close.

    function closeWindow() {
        parent.removeChild(new_div);

        for (var i = 0; i < base_collection.length; i++) {
            if (base_collection[i] === new_base) {
                base_collection.splice(i, 1); i--;
            }
            if (numberline_collection[i] === new_base_numberline) {
                numberline_collection.splice(i, 1); i--;
                if (numberline_collection[i] === new_base_numberline) {
                    numberline_collection.splice(i, 1); i--;
                }
            }
        }

    }

    close.addEventListener('click', () => {
        parent.removeChild(new_div);

        for (var i = 0; i < base_collection.length; i++) {
            if (base_collection[i] === new_base) {
                base_collection.splice(i, 1); i--;
            }
            if (numberline_collection[i] === new_base_numberline) {
                numberline_collection.splice(i, 1); i--;
                if (numberline_collection[i] === new_base_numberline) {
                    numberline_collection.splice(i, 1); i--;
                }
            }
        }
    })

    // .... when pressing "explanation".
    showExpl.addEventListener('click', () => {
        if (new_explanation.style.display === 'inline') {
            new_explanation.style.display = 'none';
        } else {
            new_explanation.style.display = 'inline';
        }
    })

})