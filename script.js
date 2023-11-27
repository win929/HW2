// month가 바뀌면 달력 테이블도 바뀌도록 설정
$(document).ready(function() {
    blankColor();
    addEvent();
    $("#month").change(function() {
        var selectedMonth = $("#month").val();
    
        $.ajax({
            url: "calendar.php",
            type: "POST",
            data: { month: selectedMonth },
            dataType: 'json',  // 응답을 JSON으로 파싱합니다.
            success: function(response) {
                $("#calendar").html(response.calendar);
                blankColor();
                addEvent();
    
                // 각 일정을 달력에 표시합니다.
                response.schedules.forEach(function(schedule) {
                    var date = Number(schedule.date.slice(-2));  // 일자를 추출합니다.
                    writeSchedule(schedule.title, date);XMLDocument
                });
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

// 달력에 저장된 일정 표시
function writeSchedule(title, date) {
    // clickedTd와 같은 dateDiv.innerHTML을 가진 td를 찾음
    var dateDiv = document.getElementsByClassName("date");
    var targetDate;
    for (let i = 0; i < 42; i++) {
        if (dateDiv[i].innerHTML == date) {
            targetDate = i+1;
            break;
        }
    }

    var blnkDiv = document.getElementById("blnk" + targetDate);

    var ol = blnkDiv.getElementsByTagName("ol");

    // 만약 ol 태그가 없다면 새로 생성
    if (ol.length === 0) {
        ol = document.createElement("ol");
        blnkDiv.appendChild(ol);
    } else {
        ol = ol[0];
    }

    // li 태그 생성하고 ol 태그에 추가
    var li = document.createElement("li");
    li.setAttribute("class", "writed");
    li.setAttribute("id", "id");
    li.innerHTML = title;
    ol.appendChild(li);
}

// dailyWrite 모달창 저장
$(document).ready(function() {
    $("#saveButton").click(function(e) {
        e.preventDefault();

        var formData = new FormData();
        var id = new Date().getTime();
        formData.append('id', id);
        formData.append('date', clickedTdToDate(clickedTd));
        formData.append('order', 1);
        formData.append('title', $("#title").val());
        formData.append('description', $("#description").val());
        formData.append('category', $("#category option:selected").text());
        formData.append('fileToUpload', $("#fileToUpload")[0].files[0]);

        $.ajax({
            type: "POST",
            url: "uploadData.php",
            data: formData,
            processData: false,  // 필수
            contentType: false,  // 필수
            success: function(data) {
                // 저장 멘트 띄우기
                alert("저장되었습니다.");

                // 달력에 일정 표시
                var targetDate = document.getElementById("date" + clickedTd).innerHTML;
                writeSchedule($("#title").val(), targetDate);

                // 모달창 닫기
                var modal = $("#dailyWrite");
                $("#title").val("");
                $("#description").val("");
                $("#category").val("todo");
                $("#fileToUpload").val("");
                modal.css("display", "none");
            }
        });
    });
});
