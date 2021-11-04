function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

var books = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalm", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"];

function answerClicked(){
    var index = getRndInteger(0,65);
    var range = getRndInteger(1,3);
    var multiplier = getMultiplier();
    var beforeafter = getBeforeAfter(multiplier);
    document.getElementById("question_content").innerHTML = "Which book comes <div class=\"emphasis\">" + range + "</div> book(s) <br><div class=\"emphasis\">" + beforeafter + "</div> <div class=\"emphasis\"><u>" +books[index] + "</u></div>?";

    $("#answer_display").hide();
    console.log(multiplier);
    var answerIndex = index + (multiplier * range);
    console.log(answerIndex);
    if (answerIndex >= 0 && answerIndex <= 65) {
        document.getElementById("answer_content").innerHTML = "The answer is<br><div class=\"emphasis\">" + books[answerIndex] +"</div>!";
    } else {
        document.getElementById("answer_content").innerHTML = "NO ANSWER, DUH~";
    }
}

function questionClicked(){
    $("#answer_display").show();
}

function getMultiplier(){
    var num = getRndInteger(0,1);
    if(num == 0){
        return -1;
    } else {
        return 1;
    }
}

function getBeforeAfter(multiplier){
    if(multiplier==-1){
        return "BEFORE";
    } else {
        return "AFTER";
    }

}

