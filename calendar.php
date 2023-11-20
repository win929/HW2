<?php
    $month = $_POST['month'];
    $year = 2023;

    // 각 달의 일수를 담은 배열 생성
    $days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // 월을 숫자로 변환
    $month_number = date('n', strtotime($month));

    // 해당 월의 일수
    $days = $days_in_month[$month_number - 1];

    // 해당 월의 첫 날의 요일
    // 0: 일요일, 1: 월요일, 2: 화요일, 3: 수요일, 4: 목요일, 5: 금요일, 6: 토요일
    $first_day = date('w', strtotime("{$year}-{$month_number}-01"));

    echo '<table>';
    echo '<tr><th>SUN</th><th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th>SAT</th></tr>';

    $dateId = 1;
    $date = 1;
    $blankId = 1;

    for ($i = 0; $i < 6; $i++) {
        echo '<tr>';
        for ($j = 0; $j < 7; $j++) {
            if ($date <= $days && $first_day < $dateId) {
                echo '<td class="date" id="date'.($dateId++).'">'.($date++).'</td>';
            } else {
                echo '<td class="date" id="date'.($dateId++).'"></td>';
            }
        }
        echo '</tr>';

        echo '<tr>';
        for ($j = 0; $j < 7; $j++) {
            echo '<td class="blank" id="blank'.($blankId++).'">';
        }
        echo '</tr>';
    }

    echo '</table>';
?>
