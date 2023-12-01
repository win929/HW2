<?php   
    header("Content-Type: text/html; charset=UTF-8");

    $id = $_POST['id'];
    $date;
    $order;
    $title;
    $description;
    $category;
    $file_name;
    $delete_time = date('Y-m-d h:i:sa');

    // JSON 파일 읽기
    $jsonString = file_get_contents('data/mylists.json');
    $data = json_decode($jsonString, true);

    // 데이터 초기화
    foreach ($data as $key => $entry) {
        if ($entry['id'] == $id) {
            $date = $data[$key]['date'];
            $order = $data[$key]['order'];
            $title = $data[$key]['title'];
            $description = $data[$key]['description'];
            $category = $data[$key]['category'];
            $file_name = $data[$key]['file_name'];

            unset($data[$key]);
        }
    }

    // order 수정
    foreach ($data as $key => $entry) {
        if ($entry['date'] == $date && $entry['order'] > $order) {
            $data[$key]['order'] = $data[$key]['order'] - 1;
        }
    }

    // 배열의 인덱스를 재설정
    $data = array_values($data);

    // JSON 형식으로 인코딩하여 파일에 다시 쓰기
    file_put_contents('data/mylists.json', json_encode($data, JSON_UNESCAPED_UNICODE));
 
    // 'mydeletelists.json' 파일 읽기
    $deletedJsonString = file_exists('data/mydeletelists.json') ? file_get_contents('data/mydeletelists.json') : '[]';
    $deletedData = json_decode($deletedJsonString, true);

    $newData = array(
        "id" => $id,
        "date" => $date,
        "title" => $title,
        "description" => $description,
        "category" => $category,
        "file_name" => $file_name,
        "delete_time" => $delete_time
    );

    // 삭제된 데이터 배열에 새로운 데이터 추가
    $deletedData[] = $newData;

    $json_string = json_encode($deletedData, JSON_UNESCAPED_UNICODE);

    // 정규 표현식을 이용하여 }, { 사이에 줄바꿈 문자 추가
    $json_string = preg_replace("/},\s*{/", "},\n{", $json_string);

    file_put_contents('data/mydeletelists.json', $json_string);

    echo "success";
?>
