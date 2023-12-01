<?php
    // mylists.json 파일에서 데이터를 가져옵니다.
    if (file_exists('data/mylists.json') && filesize('data/mylists.json') > 0) {
        // mylists.json 파일에서 데이터를 가져옵니다.
        $data = file_get_contents('data/mylists.json');
        $schedules = json_decode($data, true);
    } else {
        // 파일이 없거나 내용이 없을 경우 빈 배열을 생성합니다.
        $schedules = [];
    }

    $month = $_POST['month'];
    $year = 2023;

    // 월을 숫자로 변환
    $month_number = date('n', strtotime($month));

    // 해당 월의 일정만 선택합니다.
    $schedules_in_month = array_filter($schedules, function($schedule) use ($year, $month_number) {
        $date = strtotime($schedule['date']);
        return date('Y', $date) == $year && date('n', $date) == $month_number;
    });

    // 배열의 인덱스를 재설정합니다.
    $schedules_in_month = array_values($schedules_in_month);

    // 각 달의 일수를 담은 배열 생성
    $days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // 해당 월의 일수
    $days = $days_in_month[$month_number - 1];

    // 해당 월의 첫 날의 요일
    // 0: 일요일, 1: 월요일, 2: 화요일, 3: 수요일, 4: 목요일, 5: 금요일, 6: 토요일
    $first_day = date('w', strtotime("{$year}-{$month_number}-01"));

    $calendar = '<table>';
    $calendar .= '<tr><th>SUN</th><th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th>SAT</th></tr>';

    $date = 1; // 현재 출력하려는 날짜
    $dateId = 1; // 현재 출력하려는 날짜의 위치
    $blankId = 1; // 현재 출력하려는 빈칸의 위치

    for ($i = 0; $i < 6; $i++) {
        // date 출력
        $calendar .= '<tr>';
        for ($j = 0; $j < 7; $j++) {
            // 날짜 출력
            if ($date <= $days && ($i * 7 + $j) >= $first_day) {
                $calendar .= '<td class="date" id="date'.($dateId++).'">'.($date++).'</td>';
            } else { // 빈칸 출력
                $calendar .= '<td class="date" id="date'.($dateId++).'"></td>';
            }
        }
        $calendar .= '</tr>';

        // blnk 출력
        $calendar .= '<tr>';
        for ($j = 0; $j < 7; $j++) {
            $calendar .= '<td class="blnk" id="blnk'.($blankId++).'">';
        }
        $calendar .= '</tr>';
    }

    $calendar .= '</table>';

    // 'mydeletelists.json' 파일에서 데이터를 가져옵니다.
    if (file_exists('data/mydeletelists.json') && filesize('data/mydeletelists.json') > 0) {
        // 'mydeletelists.json' 파일에서 데이터를 가져옵니다.
        $data = file_get_contents('data/mydeletelists.json');
        $finished_schedules = json_decode($data, true);
    } else {
        // 파일이 없거나 내용이 없을 경우 빈 배열을 생성합니다.
        $finished_schedules = [];
    }

    // 해당 월의 완료된 일정만 선택합니다.
    $finished_schedules_in_month = array_filter($finished_schedules, function($schedule) use ($year, $month_number) {
        $date = strtotime($schedule['date']);
        return date('Y', $date) == $year && date('n', $date) == $month_number;
    });

    // 배열의 인덱스를 재설정합니다.
    $finished_schedules_in_month = array_values($finished_schedules_in_month);


    // 일정과 달력 정보를 배열로 반환합니다.
    $result = [
        'calendar' => $calendar,
        'schedules' => $schedules_in_month,
        'finished' => $finished_schedules_in_month
    ];

    // JSON 형식으로 인코딩하여 반환합니다.
    echo json_encode($result);
?>
