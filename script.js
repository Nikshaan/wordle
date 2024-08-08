const game_box = document.querySelector(".game-box");

index = 0;

for(i = 1; i <= 6; i++){
    let newRow = document.createElement("div");
    newRow.setAttribute("class", "box-row");
    game_box.appendChild(newRow);

    for(j = 1; j <= 5; j++){
        index += 1
        let div = document.createElement("div");
        div.setAttribute("id", index);
        div.setAttribute("class", "box")
        newRow.appendChild(div);
    }

    let newLine = document.createElement("br");
    game_box.appendChild(newLine);
}

async function randomWord(){
    const res = await fetch("https://random-word-api.vercel.app/api?words=1&length=5");
    const data = await res.json();
    return data[0];
}

randomCall = 0;
arr = [];
div_id = 0;
div_bg = 0;
guess = 0;

async function wordleGame(user_word){
    guess += 1;
    while (randomCall < 1){
        var returnedData = await randomWord();
        randomCall += 1;
    }
    arr.push(returnedData);

    let wordleWord = arr[0];
    let userWord = user_word;
    userW = [];
    wordleW = [];
    
    for(l = 0; l <= 4; l++){
        userW.push(userWord[l]);
        wordleW.push(wordleWord[l]);
    }

    const result = [];
    const solved_char = '#';

    for(k = 0; k <= 4; k++){
        if(userW[k] == wordleW[k]){
            result[k] = {
                letter: userW[k],
                status: 'green',
            };
            wordleW[k] = solved_char;
            userW[k] = solved_char;
        }
    }

    for(k = 0; k <= 4; k++){
        if(userW[k] === solved_char){
            continue;
        }
        let status = 'grey';
        const misplaced = wordleW.findIndex((char) => char === userW[k]);
        
        if(misplaced >= 0){
            status = 'yellow';
            wordleW[misplaced] = solved_char;
        }

        result[k] = {
            letter: userW[k],
            status,
        };
    }

    for(i = 0; i <= 4; i++){
        div_id += 1;
        let wordBox = document.getElementById(div_id);
        wordBox.innerHTML = result[i].letter.toUpperCase();
    }

    correct_guess = 0;

    for(i = 0; i <= 4; i++){
        div_bg += 1;
        let wordBox = document.getElementById(div_bg);

        if(result[i].status == 'green'){
            wordBox.classList.add("correct");
            correct_guess += 1;
        }
        else if(result[i].status == 'yellow'){
            wordBox.classList.add("misplaced");
        }
        else if(result[i].status == 'grey'){
            wordBox.classList.add("wrong");
        }
        
    }

    if(correct_guess == 5){
        document.querySelector(".game-box").style.display = "none";
        document.querySelector(".game-input").style.display = "none";
        document.querySelector(".win").style.display = "flex";
    }
    else if(guess == 6){
        let wrongWord = document.getElementById("wrong_guess");
        wrongWord.innerHTML = `You Failed to Guess the Word: ${arr[0]}`.toUpperCase();

        document.querySelector(".game-box").style.display = "none";
        document.querySelector(".game-input").style.display = "none";
        document.querySelector(".lose").style.display = "flex";
    }
}

function play(){
    randomCall = 0;
    arr = [];
    div_id = 0;
    div_bg = 0;
    guess = 0;
    index = 0;

    document.querySelector(".game-box").style.display = "flex";
    document.querySelector(".game-input").style.display = "flex";
    document.querySelector(".lose").style.display = "none";
    document.querySelector(".win").style.display = "none";

    for(x = 1; x <= 30; x++){
        let wordBox = document.getElementById(x);
        wordBox.innerHTML = "";
        wordBox.classList.remove("correct");
        wordBox.classList.remove("misplaced");
        wordBox.classList.remove("wrong");
    }
};

async function checkWord(user_word){
    const checkApi = "https://api.dictionaryapi.dev/api/v2/entries/en/";
    const response = await fetch(checkApi + user_word);

    if (response.status == 404 || user_word.length != 5){
        document.querySelector(".error").style.display = "flex";
    }else{
        document.querySelector(".error").style.display = "none";
        wordleGame(user_word); 
    }
}

const user_input = document.getElementById("user-input");

user_input.addEventListener("keypress", (input) =>{
    if (input.key == "Enter"){
        checkWord(user_input.value.toLowerCase());
        user_input.value = "";
    }
    }
)
