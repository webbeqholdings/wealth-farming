# blank

blank

## Attributes

- **Database**: PostgreSql
- **Storage Adapter**: localDisk

Tạo Db Postgresql trước! (ví dụ tạo DB từ Pgadmin4)
Clone repo

```sh
cd wealth-farming
npm i --force
npm run dev
```

Tạo File .env và updatee

```sh
# DATABASE_URI=postgres://{dbUserName}:{dbPassword}@localhost:{dbPort}/{dbName}
# Ví dụ
# DATABASE_URI=postgres://postgres:1122334455@localhost:5433/payload_blank_wf
```

Đợi Compile vào link localhost trong terminal , truy cập route '/admin' để tạo account CMS
