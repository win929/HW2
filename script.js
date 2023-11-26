// month가 바뀌면 달력 테이블도 바뀌도록 설정 (AJAX 이용)
$(document).ready(function() {
    blankColor();
    addEvent();
    $("#month").change(function() {
        var selectedMonth = $("#month").val();

        $.ajax({
            url: "calendar.php",
            type: "POST",
            data: { month: selectedMonth },
            success: function(data) {
                $("#calendar").html(data);
                blankColor();
                addEvent();
            }
        });
    });
});

// 각 td에 이벤트 리스너 추가
function addEvent() {
    for (let i = 1; i <= 42; i++) {
        let dateTd = document.getElementById("date" + i);
        dateTd.addEventListener("click", write);
    
        let blankTd = document.getElementById("blnk" + i);
        blankTd.addEventListener("click", write);
    }
}

// 달력 테이블에서 날짜가 없는 셀 표현
function blankColor() {
    var dateDiv = document.getElementsByClassName("date");
    var blankDiv = document.getElementsByClassName("blnk");
    for (let i = 0; i < 42; i++) {
        if (dateDiv[i].innerHTML == "") {
            dateDiv[i].style.backgroundColor = "rgba(255, 178, 178, 0.4)";
            blankDiv[i].style.backgroundColor = "rgba(255, 178, 178, 0.4)";
        }
    }
}

let clickedTd; // 클릭한 td id 저장

// dailyWrite 모달창 띄우기
function write(event) {
    if (event.target.nodeName == "DIV") {
        // 다시 클릭한 경우
    } else {
        // 처음 클릭한 경우

        // 클릭한 td의 id 값 저장
        clickedTd = event.target.id.substring(4);

        if (event.target.style.backgroundColor != "rgba(255, 178, 178, 0.4)") {
            var modal = document.getElementById("dailyWrite");
            modal.style.display = "block";
        }
    }
}

// dailyWrite 모달창 닫기
document.getElementById("cancelButton").addEventListener("click", function() {
    var modal = document.getElementById("dailyWrite");
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("category").value = "todo";
    document.getElementById("fileToUpload").value = "";
    modal.style.display = "none";
});

// 월의 이름을 숫자로 변환
function monthToNumber(monthName) {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var monthNumber = months.indexOf(monthName) + 1;
    if (monthNumber < 10) {
        monthNumber = "0" + monthNumber;
    }

    return monthNumber;
}

// clickedTd에 해당하는 날짜 정보를 구함
function clickedTdToDate(clickedTd) {
    var month = monthToNumber(document.getElementById("month").value);
    var date = document.getElementById("date" + clickedTd).innerHTML
    if (date.length == 1) {
        date = "0" + date;
    }
    
    return "2023-" + month + "-" + date;
}

// dailyWrite 모달창 저장
$(document).ready(function() {
    $("#saveButton").click(function(e) {
        e.preventDefault();

        var formData = new FormData();
        formData.append('id', new Date().getTime());
        formData.append('date', clickedTdToDate(clickedTd));
        formData.append('order', 1);
        formData.append('title', $("#title").val());
        formData.append('description', $("#description").val());
        formData.append('category', $("#category option:selected").text());
        formData.append('fileToUpload', $("#fileToUpload")[0].files[0]); 

        $.ajax({
            url: "uploadData.php",
            type: "POST",
            data: formData,
            processData: false,  // 필수
            contentType: false,  // 필수
            success: function(data) {
                console.log("success");
            }
        });
    });
});

