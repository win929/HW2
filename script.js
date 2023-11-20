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
    
        let blankTd = document.getElementById("blank" + i);
        blankTd.addEventListener("click", write);
    }
}

// 달력 테이블에서 날짜가 없는 셀 표현
function blankColor() {
    var dateDiv = document.getElementsByClassName("date");
    var blankDiv = document.getElementsByClassName("blank");
    for (let i = 0; i < 42; i++) {
        if (dateDiv[i].innerHTML == "") {
            dateDiv[i].style.backgroundColor = "rgba(255, 178, 178, 0.4)";
            blankDiv[i].style.backgroundColor = "rgba(255, 178, 178, 0.4)";
        }
    }
}

// dailyWrite 모달창 띄우기
function write(event) {
    if (event.target.nodeName == "DIV") {
        // 다시 클릭한 경우
    } else {
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
    document.getElementById("content").value = "";
    document.getElementById("category").value = "todo";
    document.getElementById("fileToUpload").value = "";
    modal.style.display = "none";
});