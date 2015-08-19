<?php
move_uploaded_file($_FILES["uploadImg"]["tmp_name"], 'uploads/'.$_FILES["uploadImg"]["name"]);
echo $_FILES["uploadImg"]["tmp_name"];
?>