<?php
$ext = pathinfo($_FILES["hImgUpLoadInput"]["name"], PATHINFO_EXTENSION);
$name = time();
move_uploaded_file($_FILES["hImgUpLoadInput"]["tmp_name"], 'uploads/'.$name.'.'.$ext);

echo './prototype/uploads/'.$name.'.'.$ext;
?>