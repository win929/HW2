<?php
    header("Content-Type: text/html; charset=UTF-8");

    // POST로 전송된 데이터 가져오기
    $id = $_POST['id'];

    // JSON 파일 읽어오기
    $json = file_get_contents('data/mylists.json');

    // JSON 데이터를 PHP 배열로 변환
    $data = json_decode($json, true);

    // id에 해당하는 데이터 찾기
    $result = array();
    foreach ($data as $item) {
        if ($item['id'] == $id) {
            $result = $item;
            break;
        }
    }

    // 찾은 데이터를 JSON 형식으로 변환하여 반환
    echo json_encode($result);

?>
