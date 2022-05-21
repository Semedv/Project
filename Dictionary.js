const addBox = document.querySelector(".add-box"),
    popupBox = document.querySelector(".popup-box"),
    popupTitle = popupBox.querySelector("header p"),
    closeIcon = popupBox.querySelector("header i"),
    titleTag = popupBox.querySelector("input"),
    descTag = popupBox.querySelector("textarea"),
    addBtn = popupBox.querySelector("button");

const words = JSON.parse(localStorage.getItem("words") || "[]");
let isUpdate = false, updateId;

addBox.addEventListener("click", () => {
    popupTitle.innerText = "Add a new word";
    addBtn.innerText = "Add word";
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
    if(window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});

function showWords() {
    if(!words) return;
    document.querySelectorAll(".word").forEach(li => li.remove());
    words.forEach((word, id) => {
        let filterDesc = word.description.replaceAll("\n", '<br/>');
        let liTag = `<li class="word">
                        <div class="details">
                            <p>${word.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateWord(${id}, '${word.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteWord(${id})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
    });
}
showWords();

function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

function deleteWord(wordId) {
    let confirmDel = confirm("Are you sure you want to delete this word?");
    if(!confirmDel) return;
    words.splice(wordId, 1);
    localStorage.setItem("words", JSON.stringify(words));
    showWords();
}

function updateWord(wordId, title, filterDesc) {
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = wordId;
    isUpdate = true;
    addBox.click();
    titleTag.value = title;
    descTag.value = description;
    popupTitle.innerText = "Update a word";
    addBtn.innerText = "Update word";
}

addBtn.addEventListener("click", e => {
    e.preventDefault();
    let title = titleTag.value.trim(),
        description = descTag.value.trim();

    if(title || description) {

        let wordInfo = {title, description}
        if(!isUpdate) {
            words.push(wordInfo);
        } else {
            isUpdate = false;
            words[updateId] = wordInfo;
        }
        localStorage.setItem("words", JSON.stringify(words));
        showWords();
        closeIcon.click();
    }
});