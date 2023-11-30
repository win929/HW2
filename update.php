<?php
    header("Content-Type: text/html; charset=UTF-8");

    // POST로 받은 데이터
    $id = $_POST['id'];
    $prevDate;
    $prevOrder;
    $newDate = $_POST['newDate'];
    $newOrder = 1;

    // JSON 파일 읽기
    $jsonString = file_get_contents('data/mylists.json');
    $data = json_decode($jsonString, true);

    // 데이터 초기화
    foreach ($data as $key => $entry) {
        if ($entry['id'] == $id) {
            $prevDate = $data[$key]['date'];
            $prevOrder = $data[$key]['order'];
        }
        if ($entry['date'] == $newDate) {
            $newOrder = $data[$key]['order'] >= $newOrder ?  $data[$key]['order'] + 1 : $newOrder;
        }
    }

    // 데이터 수정
    foreach ($data as $key => $entry) {
        if ($entry['id'] == $id) {
            $data[$key]['date'] = $newDate;
            $data[$key]['order'] = $newOrder;
        }
        if ($entry['date'] == $prevDate && $entry['order'] > $prevOrder) {
            $data[$key]['order'] = $data[$key]['order'] - 1;
        }
    }

    // 수정된 데이터를 다시 JSON 파일에 저장
    $newJsonString = json_encode($data, JSON_UNESCAPED_UNICODE);

    // 정규 표현식을 이용하여 }, { 사이에 줄바꿈 문자 추가
    $newJsonString = preg_replace("/},\s*{/", "},\n{", $newJsonString);

    file_put_contents('data/mylists.json', $newJsonString);

    echo "success";
?>
