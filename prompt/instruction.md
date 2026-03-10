

saya ingin membuat web portfolio saya pribadi menggunakan tech stack next ts, mengutamakan ui bagus dan content nya dinamis, mengusung tema dark modern namun tidak semuanya berwarna hitam untuk bagian dark nya, pertama mulai dari membuat kode migration table + seeder admin default

table yang saya butuhkan:
- users:
    - uuid
    - email
    - pw
    - name
    - created_at

- skills:
    - uuid
    - title
    - image
    - description
    - created_at

- projects
    - uuid
    - title
    - thumbnail
    - link (optional)
    - info (optional)
    - description
    - images
    - created_at

- project_images (table child of projects):
    - uuid
    - name
    - created_at

- info:
    - uuid
    - key
    - info
    - description
    - created_at


- buat menggunakan prisma
- pastikan membuat configuration untuk connect ke db
- semua credential disimpan ke dalam file .env, 