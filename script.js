let clickedTd; // 클릭한 td id 저장
let prevId; // 수정할 일정의 id 저장

$(document).ready(function () {
    // 첫 로딩 시 1월에 해당하는 일정을 불러오기
    loadCalendar("January");

    // month가 바뀌면 달력 테이블도 바뀌도록 설정
    $("#month").change(function () {
        loadCalendar($("#month").val());
    });

    // schedule 저장
    $("#saveButton").click(function (e) {
        e.preventDefault();

        var formData = new FormData();
        var id = new Date().getTime();
        formData.append("id", id);
        formData.append("date", clickedTdToDate(clickedTd));
        formData.append("order", 1);
        formData.append("title", $("#title").val());
        formData.append("description", $("#description").val());
        formData.append("category", $("#category option:selected").text());
        formData.append("fileToUpload", $("#fileToUpload")[0].files[0]);

        $.ajax({
            type: "POST",
            url: "upload.php",
            data: formData,
            processData: false, // 필수
            contentType: false, // 필수
            success: function (data) {
                // 저장 멘트 띄우기
                alert("저장되었습니다.");

                // 달력에 일정 표시
                var targetDate = $("#date" + clickedTd).html();
                writeSchedule($("#title").val(), id, targetDate);

                // unfinished 일정 표시
                writeUnfinished($("#title").val(), id);

                // 모달창 닫기
                var modal = $("#dailyWrite");
                $("#title").val("");
                $("#description").val("");
                $("#category").val("todo");
                $("#fileToUpload").val("");
                modal.css("display", "none");
            },
        });
    });

    // dailyWrite 모달창 닫기
    $("#cancelButton").click(function () {
        var modal = $("#dailyWrite");
        $("#title").val("");
        $("#description").val("");
        $("#category").val("todo");
        $("#fileToUpload").val("");
        modal.css("display", "none");
    });

    // dailyWrite 모달창 띄우기
    $(document).on("click", ".date, .blnk", function (event) {
        // 클릭한 td의 id 값 저장
        clickedTd = event.target.id.substring(4);

        if (event.target.nodeName != "LI") {
            if (event.target.style.backgroundColor != "rgba(255, 178, 178, 0.4)") {
                var modal = $("#dailyWrite");
                modal.css("display", "block");
            }
        }
    });

    // 일정 클릭 시 dailyEdit 모달창 띄우기
    $(document).on("click", ".writed", function (event) {
        // 클릭한 td의 id 값 저장
        clickedTd = event.target.id.substring(4);
        prevId = event.target.id.substring(8);

        $.ajax({
            type: "POST",
            url: "search.php",
            data: { id: prevId },
            dataType: "json",
            success: function (response) {
                // 모달창 띄우기
                var modal = $("#dailyEdit");
                modal.css("display", "block");

                // 모달창에 일정 정보 표시
                $("#editTitle").val(response.title);
                $("#editDescription").val(response.description);
                var categoryInEnglish = "";
                switch (response.category) {
                    case "할일":
                        categoryInEnglish = "todo";
                        break;
                    case "회의":
                        categoryInEnglish = "meeting";
                        break;
                    case "아이디어":
                        categoryInEnglish = "idea";
                        break;
                    case "쇼핑목록":
                        categoryInEnglish = "shopping";
                        break;
                }
                $("#editCategory").val(categoryInEnglish);
                $("#editFile").html(
                    '<a href="uploads/' + response.file_name + '" target="_blank">' + response.file_name + "</a>"
                );
            },
        });
    });

    // dailyEdit 모달창 닫기
    $(document).on("click", "#editCancelButton", function () {
        var modal = $("#dailyEdit");

        $("#editTitle").prop("disabled", true);
        $("#editDescription").prop("disabled", true);
        $("#editCategory").prop("disabled", true);
        $editFile = $("<span id='editFile'></span>");
        $("#editFileToUpload").replaceWith($editFile);

        $editButton = $("<input type='button' value='수정' id='editButton'>");
        $("#submitButton").replaceWith($editButton);

        modal.css("display", "none");
    });

    // 수정하기
    $(document).on("click", "#editButton", function () {
        // disabled 해제
        $("#editTitle").prop("disabled", false);
        $("#editDescription").prop("disabled", false);
        $("#editCategory").prop("disabled", false);

        // 파일 업로드 가능하게 함
        $editFileToUpload = $("<input type='file' name='editFileToUpload' id='editFileToUpload'></input>");
        $("#editFile").replaceWith($editFileToUpload);

        // editButton -> submitButton로 교체
        $submitButton = $("<input type='button' value='제출' id='submitButton'>");
        $("#editButton").replaceWith($submitButton);
    });

    // 수정 제출
    $(document).on("click", "#submitButton", function () {
        var newTitle = $("#editTitle").val();
        var newDescription = $("#editDescription").val();

        var formData = new FormData();
        formData.append("id", prevId);
        formData.append("title", newTitle);
        formData.append("description", newDescription);
        formData.append("category", $("#editCategory option:selected").text());
        formData.append("editFileToUpload", $("#editFileToUpload")[0].files[0]);

        $.ajax({
            type: "POST",
            url: "edit.php",
            data: formData,
            processData: false, // 필수
            contentType: false, // 필수
            success: function (response) {
                // 달력에 일정 표시하는 부분 수정
                $("#schedule" + prevId).text(newTitle);

                // unfinished 일정 표시하는 부분 수정
                $("#unfinished" + prevId).text(newTitle);

                // 모달창 닫기
                var modal = $("#dailyEdit");

                $("#editTitle").prop("disabled", true);
                $("#editDescription").prop("disabled", true);
                $("#editCategory").prop("disabled", true);
                $editFile = $("<span id='editFile'></span>");
                $("#editFileToUpload").replaceWith($editFile);

                $editButton = $("<input type='button' value='수정' id='editButton'>");
                $("#submitButton").replaceWith($editButton);

                modal.css("display", "none");
            },
        });
    });

    // drag
    $(document).on("dragstart", ".writed", function (event) {
        event.originalEvent.dataTransfer.setData("text", event.target.id);
        event.target.style.backgroundColor = "#33cc33";
        event.target.style.color = "#fff";
    });

    // dragover
    $(document).on("dragover", ".blnk, .writed", function (event) {
        event.preventDefault();

        // class가 writed인 요소인 경우
        if (event.target.className == "writed") {
            // 드래그 오버 영역에 있는 schedule의 배경색을 #aa0000, 글자색을 #fff으로 변경
            event.target.style.backgroundColor = "#aa0000";
            event.target.style.color = "#fff";
        }
    });

    // dragleave
    $(document).on("dragleave", ".writed", function (event) {
        event.preventDefault();

        // 드래그 리브 영역에 있는 schedule의 배경색과 글자색을 원래대로 변경
        event.target.style.backgroundColor = "rgba(57, 206, 180, 1)";
        event.target.style.color = "#000";
    });

    // drop
    $(document).on("drop", ".blnk, .writed", function (event) {
        event.preventDefault();
        if (event.target.className == "blnk") {
            // blnk에 드롭
            var data = event.originalEvent.dataTransfer.getData("text");

            var target = event.target;

            // ol 요소가 있는지 확인합니다.
            var ol = target.getElementsByTagName("ol")[0];

            // ol 요소가 없다면 새로 생성합니다.
            if (!ol) {
                ol = document.createElement("ol");
                target.appendChild(ol);
            }

            // 드래그한 요소를 가져옵니다.
            var draggedElement = document.getElementById(data);

            // 드래그한 요소의 스타일을 변경합니다.
            draggedElement.style.backgroundColor = "rgba(57, 206, 180, 1)";
            draggedElement.style.color = "#000";

            // ol 요소에 드래그한 요소를 추가합니다.
            ol.appendChild(draggedElement);

            $.ajax({
                type: "POST",
                url: "update.php",
                data: {
                    id: data.substring(8),
                    newDate: clickedTdToDate(target.id.substring(4)),
                    dropArea: "blnk",
                    targetId: "",
                },
                success: function (response) {},
            });
        } else {
            event.stopPropagation();

            // writed에 드롭
            var data = event.originalEvent.dataTransfer.getData("text");

            // 드래그한 요소를 가져옵니다.
            var draggedElement = document.getElementById(data);

            // 드래그한 요소의 스타일을 변경합니다.
            draggedElement.style.backgroundColor = "rgba(57, 206, 180, 1)";
            draggedElement.style.color = "#000";

            // 드롭 영역 바로 다음 sibling으로 드롭
            event.target.parentNode.insertBefore(draggedElement, event.target.nextElementSibling);

            // 드롭 영역에 있는 schedule의 배경색과 글자색을 원래대로 변경
            event.target.style.backgroundColor = "rgba(57, 206, 180, 1)";
            event.target.style.color = "#000";

            $.ajax({
                type: "POST",
                url: "update.php",
                dataType: "text",
                data: {
                    id: data.substring(8),
                    newDate: clickedTdToDate(event.target.parentNode.parentNode.id.substring(4)),
                    dropArea: "writed",
                    targetId: event.target.id.substring(8),
                },
                success: function (response) {},
            });
        }
    });

    // unfinished click
    $(document).on("click", ".writedUnfinished", function (event) {
        // 클릭한 td의 id 값 저장
        prevId = event.target.id.substring(10);

        $.ajax({
            type: "POST",
            url: "delete.php",
            data: { id: prevId },
            success: function (response) {
                // finished에 표시할 일정 만들기
                writeFinished(event.target.innerHTML, prevId);
            },
        });
    });

    // finished click
    $(document).on("click", ".writedFinished", function (event) {
        // 클릭한 td의 id 값 저장
        prevId = event.target.id.substring(8);

        alert("미완료로 표시됩니다.");

        $.ajax({
            type: "POST",
            url: "restore.php",
            data: { id: prevId },
            dataType: "json",
            success: function (response) {
                var date = Number(response.date.slice(-2));

                // 달력에 일정 표시
                writeSchedule(response.title, response.id, date);

                // unfinished 일정 표시
                writeUnfinished(response.title, response.id);

                // finished에서 일정 삭제
                $("#finished" + prevId).remove();
            },
        });
    });
});

// 달력 그리기
function loadCalendar(selectedMonth) {
    $.ajax({
        url: "calendar.php",
        type: "POST",
        data: { month: selectedMonth },
        dataType: "json", // 응답을 JSON으로 파싱합니다.
        success: function (response) {
            // 달력 테이블을 바꿉니다.
            $("#calendar").html(response.calendar);

            blankColor(); // 달력 테이블에서 날짜가 없는 셀 표현

            // unfinished 초기화
            var unfinished = document.getElementById("unfinished");
            while (unfinished.hasChildNodes()) {
                unfinished.removeChild(unfinished.firstChild);
            }

            // 각 일정을 달력에 표시합니다.
            response.schedules.forEach(function (schedule) {
                var date = Number(schedule.date.slice(-2)); // 일자를 추출합니다.
                writeSchedule(schedule.title, schedule.id, date);
                writeUnfinished(schedule.title, schedule.id);
                XMLDocument;
            });

            // finished 초기화
            var finished = document.getElementById("finished");
            while (finished.hasChildNodes()) {
                finished.removeChild(finished.firstChild);
            }

            // 각 일정을 finished에 표시합니다.
            response.finished.forEach(function (finished) {
                writeFinished(finished.title, finished.id);
            });
        },
    });
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

// 월의 이름을 숫자로 변환
function monthToNumber(monthName) {
    var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    var monthNumber = months.indexOf(monthName) + 1;
    if (monthNumber < 10) {
        monthNumber = "0" + monthNumber;
    }

    return monthNumber;
}

// clickedTd에 해당하는 날짜 정보를 구함
function clickedTdToDate(clickedTd) {
    var month = monthToNumber(document.getElementById("month").value);
    var date = document.getElementById("date" + clickedTd).innerHTML;
    if (date.length == 1) {
        date = "0" + date;
    }

    return "2023-" + month + "-" + date;
}

// 달력에 저장된 일정 표시
function writeSchedule(title, id, date) {
    // clickedTd와 같은 dateDiv.innerHTML을 가진 td를 찾음
    var dateDiv = document.getElementsByClassName("date");
    var targetDate;
    for (let i = 0; i < 42; i++) {
        if (dateDiv[i].innerHTML == date) {
            targetDate = i + 1;
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
    li.setAttribute("id", "schedule" + id);
    li.innerHTML = title;
    li.draggable = true;

    ol.appendChild(li);
}

// unfinished 일정 표시
function writeUnfinished(title, id) {
    var unfinished = document.getElementById("unfinished");
    var div = document.createElement("div");
    div.setAttribute("class", "writedUnfinished");
    div.setAttribute("id", "unfinished" + id);
    div.innerHTML = title;
    unfinished.appendChild(div);
}

// finished 일정 표시
function writeFinished(title, id) {
    var finished = document.getElementById("finished");
    var div = document.createElement("div");
    div.setAttribute("class", "writedFinished");
    div.setAttribute("id", "finished" + id);
    div.innerHTML = "<del>" + title + "</del>";
    finished.appendChild(div);

    // 달력에서 일정 삭제
    $("#schedule" + id).remove();

    // unfinished에서 일정 삭제
    $("#unfinished" + id).remove();
}
