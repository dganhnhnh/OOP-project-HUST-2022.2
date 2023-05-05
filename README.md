# chạy database ở local 
## docker
```
docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=mysecret -d -p 3306:3306 mysql:latest
```
khi đó database name sẽ là mysql 

## chạy mysql trong docker để xem db
```
docker exec -it mysql-container mysql -uroot -pmysecret
```

## file Initializer.java
huỷ comment đoạn code (chi tiết trong file) để chạy khởi tạo lấy data lần đầu tiên, rồi comment trả lại hoặc xóa file đó đi (nếu không sẽ bị báo lỗi vì gây trùng lặp dữ liệu)