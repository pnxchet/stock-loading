# Stock Loading Task Management System

## เริ่มต้นใช้งาน

### ความต้องการของระบบ
- [Docker](https://www.docker.com/get-started) และ [Docker Compose](https://docs.docker.com/compose/install/)
- ไม่จำเป็นต้องติดตั้ง Node.js หรือ PostgreSQL ในเครื่องเพราะ Docker จะจัดการให้ทั้งหมด

### วิธีการเริ่มต้นใช้งาน

1. **Clone repository**
   ```bash
   git clone https://github.com/pnxchet/stock-loading.git
   cd stock-loading
   ```

2. **เริ่มต้นระบบด้วย Docker Compose**
   ```bash
   docker-compose up -d
   ```
   คำสั่งนี้จะ:
   - สร้างและเริ่มเซิร์ฟเวอร์ PostgreSQL
   - ทำการ migrate ฐานข้อมูลด้วย Flyway
   - สร้างและเริ่มแอปพลิเคชัน Node.js

3. **ตรวจสอบว่าระบบทำงานถูกต้อง**
   ```bash
   docker ps
   ```
   คุณควรจะเห็นคอนเทนเนอร์ 3 ตัว: `postgres_db`, `flyway_migrations` และ `stock_loading_app`

## การใช้งาน API

API ทำงานที่ `http://localhost:3000/api` หลังจาก Docker Compose ทำงานสมบูรณ์

### 1. สร้างงานขนถ่ายสินค้า

**Endpoint:** `POST /api/tasks`

**ตัวอย่าง Request:**
```json
{
  "taskNumber": "TASK001",
  "createdBy": {
    "name": "John Doe",
    "role": "manager"
  },
  "product": "Computer Hardware",
  "type": "Regular Load",
  "status": "Created"
}
```

**หมายเหตุ:**
- สำหรับงานประเภท "Urgent Load" จำเป็นต้องระบุ `description`
- สำหรับงานประเภท "Special Load" จำเป็นต้องระบุ `dimensions`, `weight` และ `specialHandlingInstructions`

**ตัวอย่าง Response:**
```json
{
  "success": true,
  "task": {
    "task_number": "TASK001",
    "created_by_name": "John Doe",
    "created_by_role": "manager",
    "product": "Computer Hardware",
    "type": "Regular Load",
    "status": "Created",
    "created_at": "2025-04-18T10:00:00.000Z",
    "updated_at": "2025-04-18T10:00:00.000Z"
  }
}
```

### 2. อัปเดตงานขนถ่ายสินค้า

**Endpoint:** `PUT /api/tasks/:taskNumber`

**ตัวอย่าง Request:**
```json
{
  "status": "In Progress",
  "assignedTo": {
    "name": "Jane Smith"
  },
  "startedAt": "2025-04-18T11:00:00.000Z"
}
```

**ตัวอย่าง Response:**
```json
{
  "success": true,
  "task": {
    "task_number": "TASK001",
    "created_by_name": "John Doe",
    "created_by_role": "manager",
    "assigned_to_name": "Jane Smith",
    "product": "Computer Hardware",
    "started_at": "2025-04-18T11:00:00.000Z",
    "type": "Regular Load",
    "status": "In Progress",
    "updated_at": "2025-04-18T11:00:00.000Z"
  }
}
```

## ประเภทของงาน (Task Types)

โปรเจคนี้รองรับงาน 3 ประเภท:
- **Regular Load** - งานขนถ่ายทั่วไป
- **Urgent Load** - งานเร่งด่วน (ต้องระบุรายละเอียดเพิ่มเติม)
- **Special Load** - งานพิเศษ (ต้องระบุขนาด น้ำหนัก และคำแนะนำพิเศษ)

## สถานะของงาน (Task Statuses)

งานแต่ละชิ้นสามารถมีสถานะดังนี้:
- **Created** - เพิ่งสร้าง
- **Assigned** - มอบหมายแล้ว
- **In Progress** - กำลังดำเนินการ
- **Done** - เสร็จสมบูรณ์
- **Cancelled** - ยกเลิก
- **Cancelled by Requester** - ยกเลิกโดยผู้ขอ

## การแก้ไขปัญหา

### ปัญหา: คอนเทนเนอร์ไม่ทำงาน
- ตรวจสอบล็อกด้วยคำสั่ง: `docker logs <container_name>`
- ตรวจสอบว่าพอร์ต 5432 และ 3000 ไม่ถูกใช้งานโดยโปรแกรมอื่น

### ปัญหา: API ไม่ตอบสนอง
- ตรวจสอบว่าคอนเทนเนอร์ทั้งหมดทำงานอยู่: `docker ps`
- รีสตาร์ทแอปพลิเคชัน: `docker-compose restart app`

### ปัญหา: ฐานข้อมูลไม่ทำงาน
- ล้างข้อมูลและเริ่มต้นใหม่: `docker-compose down -v && docker-compose up -d`

## การปิดการทำงาน

เมื่อต้องการหยุดการทำงานของระบบ:
```bash
docker-compose down
```

ถ้าต้องการลบข้อมูลทั้งหมดและเริ่มต้นใหม่:
```bash
docker-compose down -v
