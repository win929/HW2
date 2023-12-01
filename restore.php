<?php   
    header("Content-Type: text/html; charset=UTF-8");

    $id = $_POST['id'];
    $date;
    $order = 1;
    $title;
    $description;
    $category;
    $file_name;

    // JSON 파일 읽기
    $deletedjsonString = file_get_contents('data/mydeletelists.json');
    $deleteDdata = json_decode($deletedjsonString, true);

    // 데이터 초기화
    foreach ($deleteDdata as $key => $entry) {
        if ($entry['id'] == $id) {
            $date = $deleteDdata[$key]['date'];
            $title = $deleteDdata[$key]['title'];
            $description = $deleteDdata[$key]['description'];
            $category = $deleteDdata[$key]['category'];
            $file_name = $deleteDdata[$key]['file_name'];

            unset($deleteDdata[$key]);
        }
    }

    // 배열의 인덱스를 재설정
    $deleteDdata = array_values($deleteDdata);

    // JSON 형식으로 인코딩하여 파일에 다시 쓰기
    file_put_contents('data/mydeletelists.json', json_encode($deleteDdata, JSON_UNESCAPED_UNICODE));
 
    // 'mylists.json' 파일 읽기
    $jsonString = file_exists('data/mylists.json') ? file_get_contents('data/mylists.json') : '[]';
    $data = json_decode($jsonString, true);

    // order 수정
    foreach ($data as $key => $entry) {
        if ($entry['date'] == $date && $entry['order'] >= $order) {
            $order = $data[$key]['order'] + 1;
        }
    }

    $newData = array(
        "id" => $id,
        "date" => $date,
        "order" => $order,
        "title" => $title,
        "description" => $description,
        "category" => $category,
        "file_name" => $file_name
    );

    // 삭제된 데이터 배열에 새로운 데이터 추가
    $data[] = $newData;

    $json_string = json_encode($data, JSON_UNESCAPED_UNICODE);

    // 정규 표현식을 이용하여 }, { 사이에 줄바꿈 문자 추가
    $json_string = preg_replace("/},\s*{/", "},\n{", $json_string);

    file_put_contents('data/mylists.json', $json_string);

    echo json_encode($newData, JSON_UNESCAPED_UNICODE);
?>
