/*사용자 행동에 반응해서 열림, 닫힌 상태 만들어보기 */

const openbutton= document.querySelector("#openBtn");
const modal = document.querySelector("#modal");
const closebutton= document.querySelector("#closeBtn");


function openModal() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","true");
}

function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","false");
}

openbutton.addEventListener("click",openModal)
closebutton.addEventListener("click",closeModal)
    



/*classList의 사용 목적: UI 상태 관리 

UI 열고 닫기는 
modal.classList.add("open")
modal.classList.remove("open")

event.target은 클릭된 요소이지,원하는 요소를 찾아주는 것이 아님
classList의 목적은 UI 상태를 클래스 하나로 관리하는 도구

function의 목적은 여러 줄 코드를 이름을 붙여 묶어두고, 필요할때 호출하는 것.


openmodal 즉 모달오픈 버튼을 클릭하면 모달창을 띄우고 싶을때

function.openModal() {
modal.classList.add("open");
}

function.clodseModal() {
modal.classList.remove("open");
}

openbutton.addEventlistener("click", openmodal)


setAttribute 

Classlist는 다시말하면, UI를 제어하기 위해 사용한다고 함.

만약 모달을 만든다고 하면
모달을 열 버튼을 클릭을 하면, 모달이 열리겠지? 열리고 닫히는 대상이 먼저오고, classList.toggle/add/remove가 들어가는거야.

여기서 뒤에 toggle/add&remove는 어떤 기준으로 나뉘냐

toggle: 하나의 버튼에서 제어가 가능할때
add&remove: 열리고 닫히는 기능이 각각 존재할때 사용을 함.

	•	toggle("open"): 버튼 하나로 열고 닫는 동작이 반복될 때(드롭다운 등)
	•	add/remove: “열기 버튼”과 “닫기 버튼”이 분리되어 있을 때(모달 등)
닫기 버튼에서 toggle을 쓰면 상태가 꼬일 수 있어 remove가 안전
*/