const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generation = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strength circle color to grey 

// Set Password Length 
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65,90));
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    // To make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array) {
    // Fisher Yates Method 
    for(let i=array.length-1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    // special condition 
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

generation.addEventListener('click', () => {
    // None of the checkbox are selected 
    if(checkCount == 0) return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // Let's start the journey to find new password
    console.log("Starting the Journey");
    // Remove old password 
    password = "";

    // Let's put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // Compulsory Addition 
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("Compulsory Addition Done");

    // Remaining Addition 
    for(let i=0; i<passwordLength-funcArr.length;i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }
    console.log("Remaining Addition Done");

    // Shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling Done");

    // Show in UI 
    passwordDisplay.value = password;
    console.log("UI Done");

    // Calculating Strength 
    calcStrength();
});