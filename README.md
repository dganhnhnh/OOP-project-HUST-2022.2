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