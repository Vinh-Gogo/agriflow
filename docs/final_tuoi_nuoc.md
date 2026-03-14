# <center>***`SYSTEM WATERING AUTO`***</center>

---

> **Đối tượng**: Vườn cây ăn trái, cây công nghiệp, rau nền, cây cảnh, cỏ
> **Quy mô**: Từ prototype 10% → pilot 30% → production 100% diện tích đất
> **Địa điểm**: Trang trại, vườn gia đình, khu vực không có điện lưới ổn định (có solar backup)

| Nền tảng | Công nghệ | Mục đích |
|---|:---|:---|
| **Edge** | ESP32-WROOM-32, FreeRTOS | Điều khiển real-time, thu thập sensor |
| **Gateway** | Raspberry Pi 4, MQTT, SQLite | Local computing, offline cache, AI/ML |
| **Cloud** | .NET, PostgreSQL, Redis, Docker | Backend, database, message broker |
| **Mobile** | .NET MAUI, SignalR | iOS/Android app, real-time dashboard |
| **Desktop** | .NET MAUI | Windows/macOS, advanced analytics |
| **DevOps** | Grafana, Prometheus, Nginx | Monitoring, SSL, backup |

## A. PLAN

### PHASE 1: Tư vấn & Thiết kế hệ thống

| STT | Hạng mục | Mô tả dịch vụ |
|:---|:---|:---|
| 1.1 | **Khảo sát hiện trạng** | • Đo đạc tổng diện tích<br>• Phân loại cây trồng: cây ăn trái/công nghiệp → Drip \| rau/cỏ/cảnh → Sprinkler<br>• Đánh giá áp suất nguồn nước |
| 1.2 | **Thiết kế bản vẽ kỹ thuật** | Thiết kế 2 vùng áp suất:<br>• **Zone Drip (1-2 bar):** Nguồn → ống to → ống nhỏ hơn → ống rất nhỏ → nhỏ giọt từng giọt<br>• **Zone Sprinkler (2-4 bar):** Nguồn → ống lớn → ống vừa → phun mưa rộng |
| **1.3** | **Xây dựng Thuật toán Thirst Index** | • **Thu thập dữ liệu:** độ ẩm đất, nhiệt độ, độ ẩm không khí, ET0, thời gian, xác suất mưa, tốc độ gió<br>• **Chọn chế độ:** Drip / Sprinkler / AUTO<br>• **Điều chỉnh:** Kc và hiệu suất theo mode<br>• **Tính toán:** Chỉ số khát<br>• **Phạt thời tiết:** mưa >30% \| gió >5m/s \| nhiệt >35°C<br>• **Xuất kết quả:** mức độ khát, chế độ khuyến nghị, thời điểm tối ưu, thời lượng, lượng nước |
| 1.4 | **Lắp đặt thiết bị điều khiển** | Bộ điều khiển trung tâm:<br>• **ESP32-WROOM-32:** Vi xử lý dual-core, WiFi + Bluetooth<br>• **RTC DS3231:** Đồng hồ thời gian thực<br>• **Buck converter LM2596:** Chuyển đổi 12V → 5V/3.3V |
| 1.5 | **Lắp đặt hệ thống cảm biến** | • 10x độ ẩm đất điện dung<br>• 2x DHT22 (nhiệt độ, độ ẩm)<br>• 2x đồng hồ lưu lượng YF-S201<br>• 2x cảm biến áp suất MPX5700<br>• Cảm biến mưa<br>• Cảm biến tốc độ gió |
| 1.6 | **Lắp đặt bộ truyền động Drip** | • 10 van điện từ 12V DC<br>• Bơm chính 550W (1-2 bar) |
| 1.7 | **Lắp đặt bộ truyền động Sprinkler** | • 5-10 van điện từ 24V AC<br>• Bơm tăng áp 1.5HP (3-4 bar)<br>• Bộ điều chỉnh áp suất 2 cấp |
| 1.8 | **Lắp đặt hệ thống nguồn** | • Nguồn 12V 10A (Drip)<br>• Biến áp 24V AC 2A (Sprinkler)<br>• Chỉnh lưu 5V/3.3V<br>• UPS 4h<br>• Tùy chọn solar 100W |
| 1.9 | **Gateway & Edge Computing** | • Raspberry Pi 4<br>• 4G LTE HAT<br>• MQTT Broker local<br>• SQLite cache offline<br>• TLS bridge<br>• Trạm thời tiết local |
| 1.10 | **Cloud Server Infrastructure** | • Docker Compose<br>• Nginx SSL<br>• PostgreSQL 15<br>• TimescaleDB<br>• Redis<br>• MinIO<br>• Elasticsearch<br>• RabbitMQ<br>• SignalR<br>• WAF |
| 1.11 | **Phát triển phần mềm Backend** | .NET Microservices:<br>• API Gateway<br>• Irrigation Service<br>• Device Service<br>• Alert Service<br>• ML Service<br><br>Công nghệ: Entity Framework, MQTTnet, RabbitMQ Event Bus, SignalR Hub |
| 1.12 | **Phát triển Gateway AI** | Local ML trên Raspberry Pi:<br>• TFLite Disease Detection<br>• Anomaly Detection<br>• Predictive Maintenance<br>• Xử lý thời tiết local |
| 1.13 | **Phát triển Firmware ESP32** | Dual-Core Architecture:<br><br>• **CORE 0 - Real-Time Control:**<br> - SensorTask<br> - SafetyTask<br> - ValveTask<br> - PumpTask<br> - PressureZoneTask<br><br>• **CORE 1 - Logic & Communication:**<br> - Thirst Index Engine<br> - Local Scheduler<br> - MQTT QoS 1<br> - OTA Signed<br> - IPC Queue |
| **1.14** | **Hoàn thiện kết nối đa nền tảng** | • **IPC Queue**: Timeout 100ms, tránh deadlock chuyển mode<br>• **Offline ET0**: Tính local trên Gateway, sync sau<br>• **Mobile**: Auto-reconnect + Push notification |

### PHASE 2: Lắp đặt thử nghiệm (10% diện tích)

| STT | Hạng mục | Mô tả dịch vụ |
|:---|:---|:---|
| 2.1 | **Lắp đặt zone thử nghiệm Hybrid** | 1 zone (10% diện tích):<br>• **70% Drip:** 7 emitter, 1 van 12V, 1.2 bar<br>• **30% Sprinkler:** 1-2 pop-up, 1 van 24V AC, 2.5 bar<br>• Test trạm tăng áp nếu cần |
| 2.2 | **Kiểm định kiến trúc Dual-Core** | • Xác minh IPC Queue<br>• Đo độ trễ real-time <100ms giữa 2 core<br>• Test chuyển đổi vùng áp suất an toàn |
| 2.3 | **Kiểm định hệ thống an toàn** | • Giả lập áp suất cao: Drip >3bar \| Sprinkler >5bar → auto-stop <100ms<br>• Test phát hiện rò rỉ (ngưỡng theo mode)<br>• Test cảm biến mưa/gió → auto-stop/delay<br>• Test chống chạy khô<br>• Test watchdog 50ms |
| 2.4 | **Hiệu chuẩn cảm biến** | • Độ ẩm đất điện dung (±5%)<br>• Cảm biến mưa<br>• Cảm biến gió |
| 2.5 | **Kiểm định luồng dữ liệu API** | End-to-end:<br>• POST sensor data<br>• GET commands (2 mode)<br>• Qua Gateway |
| 2.6 | **Kiểm định truyền thông MQTT** | • Latency ESP32→Gateway <200ms<br>• Latency Gateway→Cloud <300ms<br>• QoS 1 delivery<br>• Test lệnh chuyển mode |
| 2.7 | **Kiểm định Failover Gateway** | • Ngắt Cloud → verify local MQTT hoạt động<br>• Quyết định local theo thời tiết<br>• SQLite buffer & sync |
| 2.8 | **Kiểm định OTA an toàn** | • Signed firmware upload<br>• Rollback khi fail<br>• mDNS discovery |
| 2.9 | **Kiểm định Thirst Index** | • Xác minh tính toán Kc Drip vs Sprinkler<br>• Test phạt thời tiết (giả lập mưa)<br>• Khuyến nghị thời điểm tối ưu<br>• So sánh lượng nước 2 mode cùng diện tích |

### PHASE 3: Triển khai Pilot & Ứng dụng đa nền tảng (30% diện tích)

| STT | Hạng mục | Mô tả dịch vụ |
|:---|:---|:---|
| 3.1 | **Mở rộng 3 zone pilot** | 30% diện tích:<br>• Zone 1: Drip only<br>• Zone 2: Sprinkler only<br>• Zone 3: Hybrid (auto-switching) |
| 3.2 | **Phát triển Ứng dụng Mobile (iOS/Android)** | MAUI:<br><br>• **Dashboard:** % diện tích + mode<br>• **Real-time:** SignalR<br>• **Zone Detail:**<br> - Biểu đồ: độ ẩm, áp suất, thời tiết<br> - Lịch sử: mode & tiêu thụ<br> - Thirst Index<br> - % diện tích covered<br>• **Điều khiển thủ công:**<br> - Tưới ngay / Dừng / Override<br> - Chọn Drip/Sprinkler/Auto<br> - Chỉ báo vùng áp suất<br>• **Schedule Wizard**<br>• **Calibration UI**<br>• **Weather Guard Settings**<br>• **Alerts Center**<br>• **Offline Mode** |
| 3.3 | **Phát triển Ứng dụng Desktop (Windows/macOS)** | MAUI Desktop:<br>• Advanced Analytics<br>• Bulk Operations<br>• **Mode Analytics:** so sánh Drip vs Sprinkler<br>• **Report Generator:** PDF/Excel theo % diện tích + mode<br>• **Firmware Manager:** OTA batch<br>• **Pressure Zone Diagnostics**<br>• Diagnostics tools |
| 3.4 | **Tích hợp Weather API** | • API ngoài cho ET0<br>• Fusion: cảm biến local mưa/gió + API<br>• Fallback khi mất API |
| 3.5 | **Kiểm định Offline toàn diện** | • NVS lưu lịch 7 ngày<br>• LittleFS 30 ngày logs<br>• Gateway SQLite cache<br>• Chọn mode theo thời tiết local khi offline |
| 3.6 | **Kiểm định Local AI/ML** | • TFLite Disease Detection trên Pi<br>• Anomaly Detection<br>• Dự báo chuyển mode trước |
| 3.7 | **Kiểm định Hybrid Scheduling** | • Vận hành tuần tự: không Drip + Sprinkler đồng thời<br>• Ưu tiên Sprinkler sáng sớm<br>• Interlock bơm tăng áp |

### PHASE 4: Vận hành Production (100% diện tích)

| STT | Hạng mục | Mô tả dịch vụ |
|:---|:---|:---|
| 4.1 | **Lắp đặt 10 zone hoàn chỉnh** | 100% diện tích (~100 cây + rau):<br>• 6 zones Drip<br>• 3 zones Sprinkler<br>• 1 zone Hybrid<br>• Hoàn thiện dual pressure system<br>• Solar 100W + UPS 4h (site không điện lưới ổn định)<br>• Chiến lược bơm dự phòng |
| 4.2 | **Hiệu chuẩn toàn hệ thống** | • Cân chỉnh lưu lượng đồng đều 100% diện tích (2 mode)<br>• Hiệu chuẩn tất cả cảm biến<br>• Đảm bảo không lẫn vùng áp suất<br>• Tối ưu Kc theo mode (1 tháng thực tế)<br>• Hiệu chuẩn cảm biến thời tiết |
| 4.3 | **Triển khai Production & DevOps** | • Docker Compose production<br>• Nginx SSL auto-renew<br>• Backup: PostgreSQL/TimescaleDB hàng ngày + MinIO hàng tuần<br><br>• **Monitoring:**<br> - Grafana: % diện tích active, mode distribution, dual pressure, thời tiết<br> - Elasticsearch + Kibana<br> - Prometheus Alertmanager |
| 4.4 | **Củng cố bảo mật** | • WAF (ModSecurity/Cloudflare)<br>• Rate Limit 100/phút<br>• OTA Signed<br>• mDNS secure<br>• Cách ly điện 12V DC và 24V AC |
| 4.5 | **Kiểm định tải toàn hệ thống** | • Không cho phép tưới 100% đồng thời (tuần tự)<br>• Max concurrent: 2 zones Drip HOẶC 1 zone Sprinkler<br>• Không chạy đồng thời 2 bơm<br>• Test 100 client concurrent<br>• Test 1000 msg/s MQTT<br>• Test 500 connections PostgreSQL<br>• Giả lập mưa → auto-switch Drip |
| 4.6 | **Phân tích hiệu quả nước** | • So sánh Drip vs Sprinkler (lít/m²)<br>• ROI bơm tăng áp vs tiết kiệm nước<br>• Báo cáo độ chính xác mode AUTO |
| 4.7 | **Tài liệu hóa hệ thống** | • API docs (Swagger/OpenAPI)<br>• Database schema ERD<br>• Firmware docs (dual pressure safety)<br>• **Hybrid System User Manual:**<br> - Khi nào dùng Drip vs Sprinkler<br> - Chuyển đổi an toàn<br> - Xử lý sự cố áp suất<br>• Troubleshooting (pressure fault isolation)<br>• Deployment guide (electrical wiring dual voltage) |
| 4.8 | **Đào tạo vận hành** | • Workshop: % diện tích + mode<br>• Hands-on: chuyển đổi Drip↔Sprinkler<br>• Xử lý rain/wind guard<br>• Video tutorial: app, analytics, chọn mode<br>• Ứng phó khẩn cấp: xả áp, cách ly điện |

---

## B. LINH KIỆN

<details>

### Phase 1: Chuẩn bị & Thiết kế 

> MVP T3

| STT  | Linh kiện                |  SL  | Giá  | Mục đích                  |
| :--- | :----------------------- | :--: | :--- | :------------------------ |
| 1.1  | MODULE ESP32-WROOM-32    |   1  | 145k | Vi xử lý chính  MICRO USB CP2102 TÍCH HỢP CHỨC NĂNG WIFI + RF (2.4GHZ) + BLUETOOTH |
| 1.2  | Breadboard               |   1  | 16k  | Test prototype            |
| 1.3  | Jumper wires             | 1 bộ | 15k  | Kết nối                   |
| 1.5  | Nguồn 12V 5A             |   1  | 90k  | Cấp nguồn van + bơm nhỏ   |
| 1.6  | Buck converter LM2596    |   1  | 22k  | 12V → 5V/3.3V cho ESP32  (1 mạch ) |
| 1.8  | Soil moisture capacitive |   1  |  2k  | Đo độ ẩm đất V1.2         |
| 1.9  | DHT22                    |   1  | 70k  | Nhiệt độ, độ ẩm không khí |
| 1.10 | Dây điện RVV 2.5mm       |  10m | 90k  | Dây nguồn, tín hiệu       |
| 1.11 | Dây tín hiệu 2 lõi       |  10m | 110k |                           |

> **Mục tiêu:** Code ngay trên bàn, test firmware cơ bản

| STT  | Linh kiện                         |  SL  | **Đơn giá** | **Thành tiền** | Link sản phẩm |
| :--- | :-------------------------------- | :--: | :---------: | :------------: | :-- |
| 1.1  | **ESP32-WROOM-32**                |   1  | **145.000** |     145.000    | <https://shopee.vn/MODULE-ESP32-WROOM-32-30P-MICRO-USB-CP2102-T%C3%8DCH-H%E1%BB%A2P-CH%E1%BB%A8C-N%C4%82NG-WIFI-RF-(2.4GHZ)-BLUETOOTH-i.1292561517.25792647641> |
| 1.2  | **Breadboard 830 tie-points**     |   2  |  **25.000** |     50.000     | <https://shopee.vn/Breadboard-MB-102-830-L%E1%BB%97-165x55x10mm-Board-test-Bo-test-Bread-board-c%E1%BA%AFm-linh-ki%E1%BB%87n-b%E1%BA%A3ng-m%E1%BA%A1ch-th%E1%BB%AD-nghi%E1%BB%87m-i.404478549.18150090626> |
| 1.3  | **Jumper wires đủ loại**          | 2 bộ |  **15.000** |     30.000     | <https://shopee.vn/B%E1%BB%99-d%C3%A2y-c%E1%BA%AFm-jumper-breadboard-140-m%C3%B3n-k%C3%A8m-h%E1%BB%99p-165x55x15mm-cho-Arduino-i.22486963.6652018268> |
| 1.4  | **USB Type-C cable**              |   2  |  **20.000** |     40.000     | <https://shopee.vn/C%C3%A1p-s%E1%BA%A1c-nhanh-Type-C-TypeC-d%C3%A0i-1-m%C3%A9t-%F0%9F%8D%80-C%C3%A1p-USB-sang-TypeC-i.187715321.7643283013> |
| 1.5  | **Nguồn 12V 5A**                  |   1  |  **82.000** |     82.000     | <https://shopee.vn/Ngu%E1%BB%93n-Adapter-12V5A-AcBel-D%C3%B9ng-Cho-Camera-Ch%C3%A2n-C%E1%BA%AFm-5.5x-2.5mm-K%C3%A8m-D%C3%A2y-Ngu%E1%BB%93n-i.131989706.23747366278> |
| 1.6  | **Buck converter LM2596**         |   2  |  **17.000** |     34.000     | <https://shopee.vn/M%E1%BA%A1ch-h%E1%BA%A1-%C3%A1p-LM2596-i.920515930.24173140260> |
| 1.7  | **RTC DS3231 module**             |   1  |  **52.000** |     52.000     | <https://shopee.vn/Module-Th%E1%BB%9Di-Gian-Th%E1%BB%B1c-RTC-DS3231-i.60448325.5008972338> |
| 1.8  | **Soil moisture capacitive v1.2** |   2  |  **30.000** |     60.000     | <https://shopee.vn/C%E1%BA%A3m-bi%E1%BA%BFn-%C4%91%E1%BB%99-%E1%BA%A9m-%C4%91%E1%BA%A5t-Soil-Moisture-Sensor-v1.2-i.33035205.2982934635> |
| 1.9  | **DHT22/AM2302**                  |   2  |  **48.000** |     96.000    | <https://shopee.vn/C%E1%BA%A3m-Bi%E1%BA%BFn-Nhi%E1%BB%87t-%C4%90%E1%BB%99-v%C3%A0-%C4%90%E1%BB%99-%E1%BA%A8m-DHT22-AM2302-i.119714962.25076404984> |
| 1.10 | **Dây điện RVV 2×0.75mm²**        |  50m |  **5.380**  |     269.000    | <https://shopee.vn/(gi%C3%A1-10-m%C3%A9t)-D%C3%A2y-%C4%91i%E1%BB%87n-Cadivi-%C4%91%C3%B4i-m%E1%BB%81m-tr%C3%B2n-VCMT-2X0.75-2X1.5-2X2.5-2X4-2-l%E1%BB%9Bp-v%E1%BB%8F-b%E1%BB%8Dc-%C4%91en-i.504785724.23868416890> |
| 1.11 | **Dây tín hiệu shielded 2 lõi**   |  20m |  **9.000**  |     180.000     | <https://shopee.vn/D%C3%A2y-t%C3%ADn-hi%E1%BB%87u-2-l%C3%B5i-c%C3%B3-v%E1%BB%8F-ch%E1%BB%91ng-nhi%E1%BB%85u-i.1556381.14438483132> |
| 1.12 | **Tool kit cơ bản**               |   1  | **150.000** |     150.000    | <https://shopee.vn/B%E1%BB%99-D%E1%BB%A5ng-C%E1%BB%A5-S%E1%BB%ADa-Ch%E1%BB%AFa-16-M%C3%B3n-G%E1%BB%93m-C%E1%BB%9D-L%C3%AA-K%C3%ACm-B%C3%BAa-K%C3%A9o-M%E1%BB%8F-L%E1%BA%BFt-Tua-V%C3%ADt-L%E1%BB%A5c-Gi%C3%A1c-Th%C6%B0%E1%BB%9Bc-%C4%90o-B%C3%BAt-Th%E1%BB%AD-%C4%90i%E1%BB%87n-%C4%90a-N%C4%83ng-V8888-i.550809319.29655481778> |
|  | **TỔNG PHASE 1** |  |  | **~ 1.188.000** | |

---

### Phase 2: Prototype (**10% DIỆN TÍCH**)

**Mục tiêu:** 1 zone hoạt động thực tế

| STT | Linh kiện | SL | **Đơn giá** | **Thành tiền** | Link sản phẩm |
| :--- | :--- | :--: | :---: | :---: | :--- |
| 2.1 | **MOSFET IRF540N + PCB driver** | 1 | **15.000** | 15.000 | <https://shopee.vn/MOSFET-IRF540N-i.60448325.8732675208> |
| 2.2 | **Solenoid valve 12V 1/2"** | 1 | **145.000** | 145.000 | <https://shopee.vn/Van-%C4%91i%E1%BB%87n-t%E1%BB%AB-n%C6%B0%E1%BB%9Bc-UD8-12V-24V-220V-Van-%C4%91i%E1%BB%87n-t%E1%BB%AB-n%C6%B0%E1%BB%9Bc-UD8-12V-24V-220V-i.88062742.5836226790> |
| 2.3 | **Bơm tăng áp 220V 550W** | 1 | **1.200.000** | 1.200.000 | <https://shopee.vn/B%C6%A1m-t%C4%83ng-%C3%A1p-bi%E1%BA%BFn-t%E1%BA%A7n-th%C3%B4ng-minh-kh%C3%B4ng-ti%E1%BA%BFng-%E1%BB%93n-SHENGNENG-APF-204A-550w-i.265282968.19862981437> |
| 2.4 | **Contactor SSR 40A** | 1 | **180.000** | 180.000 | <https://shopee.vn/R%C6%A1-le-b%C3%A1n-d%E1%BA%ABn-SSR-3-pha-DC-to-AC-input-5-32Vdc-480Vac-d%C3%B2ng-40A-60A-80A-100A-120A-150A-200A-Solid-State-Relay-i.63305634.24511315931> |
| 2.5 | **Bồn chứa 500L** | 1 | **850.000** | 850.000 | <https://shopee.vn/B%E1%BB%93n-ch%E1%BB%A9a-n%C6%B0%E1%BB%9Bc-INOX-500L-T%C3%82N-M%E1%BB%B8-ch%C3%ADnh-h%C3%A3ng-i.66938339.22835148660> |
| 2.6 | **Float switch** | 2 | **20.000** | 40.000 | <https://shopee.vn/C%C3%B4ng-t%E1%BA%AFc-phao-c%E1%BA%A3m-bi%E1%BA%BFn-%C3%A1p-su%E1%BA%A5t-n%C6%B0%E1%BB%9Bc-Pbfun-Zp2508-Mini-Pp-36mm-ch%E1%BA%A5t-l%C6%B0%E1%BB%A3ng-cao-i.213820428.7941395924> |
| 2.7 | **Lọc đĩa 120 mesh 3/4"** | 1 | **320.000** | 320.000 | <https://shopee.vn/L%E1%BB%8Dc-%C4%91%C4%A9a-ch%E1%BB%AF-Y-(3-4-(inch)-27mm-L%E1%BB%8Dc-%C4%91%C4%A9a-t%C6%B0%E1%BB%9Bi-c%C3%A2y-L%E1%BB%8Dc-n%C6%B0%E1%BB%9Bc-ch%E1%BB%AF-Y-i.70479353.4230392653> |
| 2.8 | **Van một chiều 1/2"** | 2 | **45.000** | 90.000 | <https://shopee.vn/Van-m%E1%BB%99t-chi%E1%BB%81u-%C4%91%E1%BB%93ng-MPV-ren-1-2-inch-i.1097845497.42470531046> |
| 2.9 | **MPX5700 Pressure sensor** | 1 | **85.000** | 85.000 | <https://shopee.vn/M%C3%A1y-ph%C3%A1t-c%E1%BA%A3m-bi%E1%BA%BFn-%C3%A1p-su%E1%BA%A5t-analog-MPX5700AP-MPX5700-ch%C3%ADnh-h%C3%A3ng-ho%C3%A0n-to%C3%A0n-m%E1%BB%9Bi-SIP-6-i.972724310.25846628482> |
| 2.10 | **YF-S201 Flow sensor** | 1 | **85.000** | 85.000 | <https://shopee.vn/C%E1%BA%A3m-bi%E1%BA%BFn-l%C6%B0u-l%C6%B0%E1%BB%A3ng-n%C6%B0%E1%BB%9Bc-YF-S201-(1-30L-Ph%C3%BAt-DC-3.5V-24V)-i.119714962.20495344035> |
| 2.11 | **Ống PE20 (50m)** | 1 | **900.000** | 900.000 | <https://shopee.vn/50m-%E1%BB%90ng-LDPE-20mm-d%C3%A0y-1-2MM-ASOP-(Cu%E1%BB%99n-50m)-i.301981353.10653838218> |
| 2.12 | **Ống PE16 (50m)** | 1 | **600.000** | 600.000 | <https://shopee.vn/50m-%E1%BB%90ng-LDPE-16mm-d%C3%A0y-1-2MM-ASOP-(Cu%E1%BB%99n-50m)-i.301981353.11353880535> |
| 2.13 | **Co, te, nối nhanh PE20/16** | 1 bộ | **300.000** | 300.000 | <https://shopee.vn/Compo-5-c%C3%A1i-c%C3%BAt-g%C3%B3c-n%E1%BB%91i-th%E1%BA%B3ng-t%C3%AA-%E1%BB%91ng-lu%E1%BB%93n-d%C3%A2y-%C4%91i%E1%BB%87n-phi-20mm-i.554442381.25797557565> |
| 2.14 | **Emitter Netafim 2LPH** | 10 | **12.000** | 120.000 | <https://shopee.vn/B%C3%A9c-t%C6%B0%E1%BB%9Bi-nh%E1%BB%8F-gi%E1%BB%8Dt-8-tia-c%C3%B3-que-c%E1%BA%AFm-kh%E1%BB%9Bp-n%E1%BB%91i-6mm-%C4%90i%E1%BB%81u-ch%E1%BB%89nh-%C4%91%C6%B0%E1%BB%A3c-l%C6%B0u-l%C6%B0%E1%BB%A3ng-i.418995420.22268398474> |
| 2.15 | **Stake cố định** | 10 | **3.500** | 35.000 | <https://shopee.vn/10-Que-ch%E1%BB%91ng-d%C3%B9ng-%C4%91%E1%BB%A1-%E1%BB%91ng-t%C6%B0%E1%BB%9Bi-b%C3%A9c-nh%E1%BB%8F-gi%E1%BB%8Dt-i.63516958.21092829448> |
| 2.16 | **Micro tube 6mm (50m)** | 1 | **85.000** | 85.000 | <https://shopee.vn/10M-5M-%E1%BB%90NG-D%C3%82Y-T%C6%AF%E1%BB%9AI-C%C3%82Y-PE-%C4%90EN-6MM-6LY-(4-7MM)-%E1%BB%90ng-d%E1%BA%ABn-n%C6%B0%E1%BB%9Bc-d%C3%B9ng-trong-h%E1%BB%87-th%E1%BB%91ng-t%C6%B0%E1%BB%9Bi-phun-s%C6%B0%C6%A1ng-nh%E1%BB%8F-gi%E1%BB%8Dt-s%C3%A2n-v%C6%B0%E1%BB%9Dn-i.58408575.9429396342> |
| 2.17 | **Dây điện 12V 2×1.5mm² (100m)** | 1 | **450.000** | 450.000 | <https://shopee.vn/D%C3%82Y-%C4%90I%E1%BB%86N-%C4%90%C3%94I-M%E1%BB%80M-CADIVI-2x30-2-x-1-5-mm2-CU%E1%BB%98N-100M-CH%C3%8DNH-H%C3%83NG-GI%C3%81-R%E1%BA%BA-i.251136098.10389584237> |
| 2.18 | **Ống luồn dây 20mm (25m)** | 1 | **175.000** | 175.000 | <https://shopee.vn/%E1%BB%90ng-ru%E1%BB%99t-g%C3%A0-phi-16-mm-20mm-25mm-phi-32mm-%E1%BB%91ng-%C4%91%C3%A0n-h%E1%BB%93i-lu%E1%BB%93n-d%C3%A2y-%C4%91i%E1%BB%87n-ch%C3%ADnh-h%C3%A3ng-MPE-i.1192293068.29504049380> |
| 2.19 | **Hộp nối chống nước IP65** | 2 | **35.000** | 70.000 | <https://shopee.vn/H%E1%BB%99p-n%E1%BB%91i-v%E1%BB%9Bi-tai-c%E1%BB%91-%C4%91%E1%BB%8Bnh-ch%E1%BB%91ng-n%C6%B0%E1%BB%9Bc-IP65-Universal-i.126607696.24127262944> |
| 2.20 | **Dommo nối dây** | 10 | **4.000** | 40.000 | <https://shopee.vn/Domino-n%E1%BB%91i-d%C3%A2y-%C4%91i%E1%BB%87n-i.480253483.18936106415> |
| 2.21 | **Heatshrink tube** | 1 bộ | **60.000** | 60.000 | <https://shopee.vn/10M-Heat-Shrink-Tube-2-1-Polyolefin-%E1%BB%90ng-Co-Nhi%E1%BB%87t-0.6mm-0.8mm-1mm-1.5mm-2mm-2.5mm-3mm-C%C3%A1p-Nhi%E1%BB%87t-Tay-C%C3%A1ch-Nhi%E1%BB%87t-B%E1%BA%A3o-V%E1%BB%87-D%C3%A2y-Qu%E1%BA%A5n-DIY-K%E1%BA%BFt-N%E1%BB%91i-S%E1%BB%ADa-Ch%E1%BB%AFa-i.562488262.29051167907> |
| 2.22 | **CB chống giật 30mA** | 1 | **280.000** | 280.000 | <https://shopee.vn/CB-Ch%E1%BB%91ng-Gi%E1%BA%ADt-Nh%E1%BA%ADt-B%E1%BA%A3n-30A-30mA-L%E1%BA%AFp-t%E1%BB%95ng-aptomat-ch%E1%BB%91ng-gi%E1%BA%ADt-i.22691085.1958882262> |
| 2.23 | **Cầu chì 12V + holder** | 3 | **8.000** | 24.000 | <https://shopee.vn/-NNVG12-B%E1%BB%99-c%E1%BA%A7u-ch%C3%AC-d%C3%B9ng-xe-m%C3%A1y-xe-s%E1%BB%91-v%C3%A0-tay-ga-ngu%E1%BB%93n-12V-DC-i.319657349.24452858664> |
| 2.24 | **Acid citric vệ sinh** | 1 | **40.000** | 40.000 | <https://shopee.vn/-1KG-B%E1%BB%99t-Acid-Citric-d%C3%B9ng-v%E1%BB%87-sinh-m%C3%A1y-%C4%91i%E1%BB%87n-gi%E1%BA%A3i-ion-ki%E1%BB%81m-Kangen-Trim-Ion-Panasonic-Mitsubishi-Impart-Fujiryoki...-i.728044317.19396290065> |
| | **TỔNG PHASE 2** | | | **6.029.000đ** | |

---

### Phase 3: Pilot (**30% DIỆN TÍCH**)

**Mục tiêu:** 3 zone

| STT | Linh kiện | SL | **Đơn giá** | **Thành tiền** | Link sản phẩm |
| :--- | :--- | :--: | :---: | :---: | :--- |
| 3.1 | **MOSFET IRF540N + PCB driver** | 2 | **15.000** | 30.000 | <https://shopee.vn/MOSFET-IRF540N-i.60448325.8732675208> (cần mua thêm PCB driver riêng) |
| 3.2 | **Solenoid valve 12V 1/2"** | 2 | **145.000** | 290.000 | <https://shopee.vn/Van-%C4%91i%E1%BB%87n-t%E1%BB%AB-1-2-cho-kh%C3%B4ng-kh%C3%AD-n%C6%B0%E1%BB%9Bc-N-C-th%C6%B0%E1%BB%9Dng-%C4%91%C3%B3ng-DC-12V-i.1337136999.28968940292> |
| 3.3 | **Soil moisture capacitive** | 2 | **55.000** | 110.000 | <https://shopee.vn/C%E1%BA%A3m-bi%E1%BA%BFn-%C4%91%E1%BB%99-%E1%BA%A9m-%C4%91%E1%BA%A5t-v%C3%A0-module-%C4%90%E1%BB%99-%E1%BA%A9m-%C4%90%E1%BA%A5t-%C4%91i%E1%BB%87n-dung-%C4%90%E1%BB%99-%E1%BA%A9m-%C4%91%E1%BA%A5t-ch%E1%BB%91ng-%C4%83n-m%C3%B2n-i.1394580583.26572425867> |
| 3.4 | **DHT22/AM2302** | 1 | **65.000** | 65.000 | <https://shopee.vn/C%E1%BA%A3m-bi%E1%BA%BFn-nhi%E1%BB%87t-v%C3%A0-%C4%91%E1%BB%99-%E1%BA%A9m-Dht11-Dht22-Am2302-Am2301-Am2320-Ky-015-i.81431289.11837048450> |
| 3.5 | **Ống PE20 (30m)** | 1 | **168.000** | 168.000 | <https://shopee.vn/%E1%BB%90NG-LDPE-ASOP-20mm-D%C3%80Y-1.2mm-d%C3%A0i-30m-d%C3%B9ng-trong-h%E1%BB%87-th%E1%BB%91ng-t%C6%B0%E1%BB%9Bi-i.88747236.5955188449> |
| 3.6 | **Ống PE16 (50m)** | 1 | **600.000** | 600.000 | <https://shopee.vn/50m-%E1%BB%90ng-LDPE-16mm-d%C3%A0y-1-2MM-ASOP-(Cu%E1%BB%99n-50m)-i.301981353.11353880535> |
| 3.7 | **Fittings PE20/16** | 1 bộ | **200.000** | 200.000 | <https://shopee.vn/Combo-50-c%C3%A1i-T%C3%AA-n%E1%BB%91i-3-ng%C3%A3-16mm-20mm-25mm-t%C3%AA-chia-3-%E1%BB%91ng-n%C6%B0%E1%BB%9Bc-i.558640604.19376496390> |
| 3.8 | **Emitter Netafim 2LPH** | 20 | **12.000** | 240.000 | <https://shopee.vn/B%E1%BB%99-25-c%C3%A1i-B%C3%A9c-t%C6%B0%E1%BB%9Bi-c%C3%A2y-nh%E1%BB%8F-gi%E1%BB%8Dt-b%C3%B9-%C3%A1p-2lit-gi%E1%BB%9D-Xu%E1%BA%A5t-x%E1%BB%A9-Australia-i.915264070.22110851706> |
| 3.9 | **Stake cố định** | 20 | **3.500** | 70.000 | <https://shopee.vn/10-Que-ch%E1%BB%91ng-d%C3%B9ng-%C4%91%E1%BB%A1-%E1%BB%91ng-t%C6%B0%E1%BB%9Bi-b%C3%A9c-nh%E1%BB%8F-gi%E1%BB%8Dt-i.63516958.21092829448> (mua 2 bộ) |
| 3.10 | **Micro tube 6mm (50m)** | 1 | **85.000** | 85.000 | <https://shopee.vn/Cu%E1%BB%99n-%E1%BB%91ng-pe-6mm-100M-m%E1%BB%81m-d%C3%B9ng-cho-h%E1%BB%87-th%E1%BB%91ng-nh%E1%BB%8F-gi%E1%BB%8Dt-phun-s%C6%B0%C6%A1ng-phun-m%C6%B0a-PH%E1%BB%A4-KI%E1%BB%86N-T%C6%AF%E1%BB%9AI-GI%C3%81-S%E1%BB%88-i.23143923.3544447684> (mua 50m) |
| 3.11 | **Dây điện 12V 2×1.5mm² (100m)** | 1 | **450.000** | 450.000 | <https://shopee.vn/CADIVI-D%C3%82Y-%C4%90I%E1%BB%86N-%C4%90%C3%94I-M%E1%BB%80M-D%E1%BA%B8T-VCMD-2x30-(2x1.5mm2)-CU%E1%BB%98N-100M-CH%C3%8DNH-H%C3%83NG-GI%C3%81-R%E1%BA%BA-KH%E1%BA%A2I-PH%C6%AF%E1%BB%9AC-ELECTRIC-i.230534720.10212028303> |
| 3.12 | **Dây tín hiệu shielded (30m)** | 30m | **6.500** | 195.000 | <https://shopee.vn/D%C3%A2y-t%C3%ADn-hi%E1%BB%87u-VGA-20m-25m-30m-tr%E1%BA%AFng-ch%E1%BB%91ng-nhi%E1%BB%85u.-h%C3%A0ng-ch%E1%BA%A5t-l%C6%B0%E1%BB%A3ng-HD-720p-i.369062508.7176080819> |
| 3.13 | **Hộp nối IP65** | 2 | **35.000** | 70.000 | <https://shopee.vn/H%E1%BB%99p-n%E1%BB%91i-v%E1%BB%9Bi-tai-c%E1%BB%91-%C4%91%E1%BB%8Bnh-ch%E1%BB%91ng-n%C6%B0%E1%BB%9Bc-IP65-Universal-i.126607696.24127262944> |
| 3.14 | **Dommo nối dây** | 10 | **4.000** | 40.000 | <https://shopee.vn/Domino-n%E1%BB%91i-d%C3%A2y-%C4%91i%E1%BB%87n-3A-5A-6A-10A-15A-30A-60A-i.480253483.18936106415> |
| | **TỔNG PHASE 3** | | | **2.613.000đ** | |

---

### Phase 4: Production (**100% DIỆN TÍCH**)

**Mục tiêu:** Full 10 zone

| STT  | Linh kiện  |  SL  |  **Đơn giá**  | **Thành tiền** | Link sản phẩm |
| :--- | :--- | :--: | :---: | :---: | :---- |
| 4.1  | **MOSFET IRF540N + PCB driver**  | 7  | **15.000**  | 105.000  | <https://shopee.vn/MOSFET-IRF540N-i.60448325.8732675208> (mua 7 cái, tự thiết kế PCB driver)  |
| 4.2  | **Solenoid valve 12V 1/2"**  | 7  |  **145.000**  |  1.015.000 | <https://shopee.vn/Van-%C4%91i%E1%BB%87n-t%E1%BB%AB-1-2-cho-kh%C3%B4ng-kh%C3%AD-n%C6%B0%E1%BB%9Bc-N-C-th%C6%B0%E1%BB%9Dng-%C4%91%C3%B3ng-DC-12V-i.1337136999.28968940292> |
| 4.3  | **Soil moisture capacitive** | 7  | **55.000**  | 385.000  | <https://shopee.vn/C%E1%BA%A3m-bi%E1%BA%BFn-%C4%91%E1%BB%99-%E1%BA%A9m-%C4%91%E1%BA%A5t-v%C3%A0-module-%C4%90%E1%BB%99-%E1%BA%A9m-%C4%90%E1%BA%A5t-%C4%91i%E1%BB%87n-dung-%C4%90%E1%BB%99-%E1%BA%A9m-%C4%91%E1%BA%A5t-ch%E1%BB%91ng-%C4%83n-m%C3%B2n-i.1394580583.26572425867>  |
| 4.4  | **DHT22/AM2302** | 1  | **65.000**  | 65.000 | <https://shopee.vn/C%E1%BA%A3m-bi%E1%BA%BFn-nhi%E1%BB%87t-v%C3%A0-%C4%91%E1%BB%99-%E1%BA%A9m-Dht11-Dht22-Am2302-Am2301-Am2320-Ky-015-i.81431289.11837048450>  |
| 4.5  | **Soil temp DS18B20**  | 2  | **35.000**  | 70.000 | <https://shopee.vn/M%C3%B4-%C4%91un-c%E1%BA%A3m-bi%E1%BA%BFn-nhi%E1%BB%87t-%C4%91%E1%BB%99-k%E1%BB%B9-thu%E1%BA%ADt-s%E1%BB%91-18B20-DS18B20-cho-Arduino-DC-5V-Dupont-ch%E1%BA%A5t-l%C6%B0%E1%BB%A3ng-i.578443443.13142253482>  |
| 4.6  | **UPS module 12V + pin 18650×3** | 1  |  **360.000**  | 360.000  | <https://shopee.vn/M%C3%B4-%C4%90un-T%C4%83ng-%C3%81p-Ngu%E1%BB%93n-%C4%90i%E1%BB%87n-DC-UPS-5V-12V-15W-18650-i.711737632.21189553557>  |
| 4.7  | **Hộp điện ABS IP65**  | 1  |  **120.000**  | 120.000  | <https://shopee.vn/H%E1%BB%99p-T%E1%BB%A7-%C4%90i%E1%BB%87n-Ch%E1%BB%91ng-N%C6%B0%E1%BB%9Bc-24-WAY-IP65-Nh%E1%BB%B1a-ABS-Cao-C%E1%BA%A5p-Ch%E1%BB%91ng-Va-%C4%90%E1%BA%ADp-Ch%E1%BB%8Bu-Th%E1%BB%9Di-Ti%E1%BA%BFt-Kh%E1%BA%AFc-Nghi%E1%BB%87t-chuy%C3%AAn-d%C3%B9ng-cho-solar-i.5545311.44007200775>  |
| 4.8  | **Tản nhiệt + fan 40mm** | 1  | **45.000**  | 45.000 | <https://shopee.vn/Qu%E1%BA%A1t-t%E1%BA%A3n-nhi%E1%BB%87t-40mm-X-10mm-4010-12V-v%C3%A0-24V-i.33866900.2356720557> |
| 4.9  | **Nguồn 12V 15A**  | 1  |  **280.000**  | 280.000  | <https://shopee.vn/Ngu%E1%BB%93n-Adapter-12V-15A-B%E1%BB%99-Chuy%E1%BB%83n-%C4%90%E1%BB%95i-ngu%E1%BB%93n-Adapter-12V-15A-C%C3%B4ng-su%E1%BA%A5t-180W-h%C3%A0ng-s%E1%BB%8Bn-b%C3%A3i-ch%C3%ADnh-h%C3%A3ng-i.145065667.42912312227>  |
| 4.10 | **Lọc Y 3/4"** | 1  | **95.000**  | 95.000 | <https://shopee.vn/L%E1%BB%8Dc-%C4%91%C4%A9a-ch%E1%BB%AF-Y-(3-4-(inch)-27mm-L%E1%BB%8Dc-%C4%91%C4%A9a-t%C6%B0%E1%BB%9Bi-c%C3%A2y-L%E1%BB%8Dc-n%C6%B0%E1%BB%9Bc-ch%E1%BB%AF-Y-i.70479353.4230392653> |
| 4.11 | **Ống PE20 (20m)** | 1  |  **168.000**  | 168.000  | <https://shopee.vn/-%E1%BB%90ng-T%C6%B0%E1%BB%9Bi-C%C3%A2y-LDPE-Phi-20mm-Cu%E1%BB%99n-20m-D%C3%B9ng-D%E1%BA%ABn-N%C6%B0%E1%BB%9Bc-T%C6%B0%E1%BB%9Bi-C%C3%A2y-N%C3%B4ng-nghi%E1%BB%87p-S%C3%A2n-V%C6%B0%E1%BB%9Dn-G%E1%BA%AFn-B%C3%A9c-T%C6%B0%E1%BB%9Bi-C%C3%A2y-i.394697078.27086561456> |
| 4.12 | **Ống PE16 (100m)**  | 1  | **1.200.000** |  1.200.000 | <https://shopee.vn/100m-%E1%BB%90ng-LDPE-16mm-d%C3%A0y-1-2MM-ASOP-(Cu%E1%BB%99n-100m)-i.301981353.12618568207>  |
| 4.13 | **Ống micro 6mm (200m)** | 1  |  **340.000**  | 340.000  | <https://shopee.vn/Cu%E1%BB%99n-200m-%E1%BB%90ng-D%C3%A2y-PE-LDPE-6mm-5x7mm-C%E1%BB%A9ng-D%E1%BA%BBo-B%E1%BB%81n-D%C3%A2y-6-li-Lo%E1%BA%A1i-T%E1%BB%91t-i.23143923.3544447684>  |
| 4.14 | **Fittings đủ loại** | 1 bộ |  **500.000**  | 500.000  | <https://shopee.vn/Combo-50-c%C3%A1i-T%C3%AA-n%E1%BB%91i-3-ng%C3%A3-16mm-20mm-25mm-t%C3%AA-chia-3-%E1%BB%91ng-n%C6%B0%E1%BB%9Bc-i.558640604.19376496390>  |
| 4.15 | **Emitter Netafim 2LPH** |  70  | **12.000**  | 840.000  | <https://shopee.vn/B%E1%BB%99-25-c%C3%A1i-B%C3%A9c-t%C6%B0%E1%BB%9Bi-c%C3%A2y-nh%E1%BB%8F-gi%E1%BB%8Dt-b%C3%B9-%C3%A1p-2lit-gi%E1%BB%9D-Xu%E1%BA%A5t-x%E1%BB%A9-Australia-i.915264070.22110851706> (mua 3 bộ) |
| 4.16 | **Stake cố định**  |  70  | **3.500** | 245.000  | <https://shopee.vn/10-Que-ch%E1%BB%91ng-d%C3%B9ng-%C4%91%E1%BB%A1-%E1%BB%91ng-t%C6%B0%E1%BB%9Bi-b%C3%A9c-nh%E1%BB%8F-gi%E1%BB%8Dt-i.63516958.21092829448> (mua 7 bộ)  |
| 4.17 | **Nối T 4mm**  |  30  | **2.000** | 60.000 | <https://shopee.vn/Combo-20-c%C3%A1i-kh%E1%BB%9Bp-n%E1%BB%91i-ch%E1%BB%AF-T-d%C3%B9ng-cho-%E1%BB%91ng-t%C6%B0%E1%BB%9Bi-nh%E1%BB%8F-gi%E1%BB%8Dt-4x6mm-n%E1%BB%91i-T-chia-%C4%91%C6%B0%E1%BB%A3c-d%C3%B9ng-trong-h%E1%BB%87-th%E1%BB%91ng-t%C6%B0%E1%BB%9Bi-nh%E1%BB%8F-gi%E1%BB%8Dt.-i.424639369.23837451195> (mua 2 bộ) |
| 4.18 | **Dây điện 12V 2×1.5mm² (100m)** | 1  |  **450.000**  | 450.000  | <https://shopee.vn/D%C3%82Y-%C4%90I%E1%BB%86N-%C4%90%C3%94I-M%E1%BB%80M-CADIVI-2x30-(2x1.5mm2)-CU%E1%BB%98N-100M-CH%C3%8DNH-H%C3%83NG-GI%C3%81-R%E1%BA%BA-KH%E1%BA%A2I-PH%C6%AF%E1%BB%9AC-ELECTRIC-i.230534720.10212028303> |
| 4.19 | **Dây nguồn bơm 2.5mm² (20m)** | 1  |  **180.000**  | 180.000  | <https://shopee.vn/D%C3%A2y-%C4%91i%E1%BB%87n-%C4%91%C6%A1n-b%E1%BB%8Dc-nh%E1%BB%B1a-Cadivi-2.5mm2-%C4%91i%E1%BB%87n-%C3%A1p-0.6-1kV-Combo-5m-10m-20m.-i.781366734.41002888065> (mua 20m) |
| 4.20 | **Ống luồn dây 20mm (25m)**  | 1  |  **175.000**  | 175.000  | <https://shopee.vn/-%E1%BB%90ng-ru%E1%BB%99t-g%C3%A0-phi-16-mm-20mm-25mm-phi-32mm-%E1%BB%91ng-%C4%91%C3%A0n-h%E1%BB%93i-lu%E1%BB%93n-d%C3%A2y-%C4%91i%E1%BB%87n-ch%C3%ADnh-h%C3%A3ng-MPE-i.1192293068.29504049380>  |
| 4.21 | **Dommo nối dây**  |  20  | **4.000** | 80.000 | <https://shopee.vn/Domino-n%E1%BB%91i-d%C3%A2y-%C4%91i%E1%BB%87n-3A-5A-6A-10A-15A-30A-60A-i.480253483.18936106415>  |
| 4.22 | **Cầu chì 12V**  | 3  | **8.000** | 24.000 | <https://shopee.vn/-NNVG12-B%E1%BB%99-c%E1%BA%A7u-ch%C3%AC-d%C3%B9ng-xe-m%C3%A1y-xe-s%E1%BB%91-v%C3%A0-tay-ga-ngu%E1%BB%93n-12V-DC-i.319657349.24452858664> |
|  | **TỔNG PHASE 4** |  | | **6.707.000đ** | |

</details>

---

## C. SYSTEM WORKFLOW

> [Mermaid: https://mermaid.ai/d/001673b2-241c-4441-97e2-8d16cc7debd8](https://mermaid.ai/d/001673b2-241c-4441-97e2-8d16cc7debd8)
 
<details>

![alt text](auto-watering_workflow-3.png)

<details>

<summary> more code </summary>

```text
---
config:
  layout: elk
---
flowchart TB
 subgraph HARDWARE["**1. HARDWARE LAYER**"]
    direction TB
        SENSORS["**1.1 Sensors Array**
        1. 10 Capacitive Soil Moisture
        2. 2 DHT22 Temp Humidity
        3. 1 YF-S201 Flow Meter
        4. 1 MPX5700 Pressure
        5. 1 DS3231 RTC"]
        ACTUATORS["**1.2 Actuators Hub**
        1. 10 Solenoid Valve 12V
        2. 1 Main Pump 1000LPH
        3. Safety Interlock Chain"]
        POWER["**1.3 Power Management**
        1. 12V 10A Main Supply
        2. 5V 3.3V Regulators
        3. UPS Battery 4h
        4. Solar 100W Optional"]
  end
 subgraph CORE0["**2.1 CORE 0 - Real-Time Control**"]
        RTOS["**2.1.1 FreeRTOS Tasks**
        1. SensorTask: 1s
        2. SafetyTask: 100ms
        3. ValveTask: Event
        4. PumpTask: State Machine"]
        SAFETY["**2.1.2 Safety Monitor**
        1. Pressure GREATER THAN 3bar: STOP
        2. Flow anomaly: Leak
        3. Dry-run protection
        4. Watchdog 50ms"]
        STATE["**2.1.3 State Machine**
        1. IDLE CHECK DECIDE
        2. IRRIGATE VERIFY
        3. Emergency: STOP
        4. Recovery: Restart"]
  end
 subgraph CORE1["**2.2 CORE 1 - Communication AND Logic**"]
        LOGIC["**2.2.1 Thirst Index Engine**
        1. Input: soil temp humidity time
        2. TI EQUALS f moisture ET0 Kc
        3. Output: URGENT NORMAL LOW SKIP
        4. Learning: Adjust Kc"]
        SCHEDULER["**2.2.2 Local Scheduler**
        1. NVS: 7-day schedule
        2. LittleFS: 30-day logs
        3. Override Queue
        4. Fallback: Safe default"]
        COMM["**2.2.3 Communication Stack**
        1. WiFi Manager
        2. MQTT QoS 1
        3. NTP PLUS RTC
        4. OTA Signed
        5. mDNS Discovery"]
  end
 subgraph EDGE["**2. EDGE LAYER - ESP32 Dual-Core**"]
    direction TB
        CORE0
        CORE1
        IPC["**2.3 IPC Queue**
        FreeRTOS Queue
        10 msg depth"]
  end
 subgraph GATEWAY["**3. GATEWAY LAYER**"]
    direction TB
        EDGE_GATEWAY["**3.1 Edge Gateway**
        1. Raspberry Pi 4
        2. Local MQTT Broker
        3. SQLite Cache
        4. 4G LTE Backup"]
        LOCAL_AI["**3.2 Local ML**
        1. TFLite Disease
        2. Anomaly Detect
        3. Predictive Maint"]
  end
 subgraph MICROSERVICES["**4.2 Microservices**"]
        API_GATEWAY["**4.2.1 API Gateway**
        1. JWT Validation
        2. Routing
        3. Aggregation"]
        IRRIGATION_SVC["**4.2.2 Irrigation Service**
        1. Zone CRUD
        2. Schedule Orchestration
        3. Manual Override
        4. Analytics"]
        DEVICE_SVC["**4.2.3 Device Service**
        1. ESP32 Lifecycle
        2. OTA Management
        3. Command Queue
        4. Health Monitor"]
        ALERT_SVC["**4.2.4 Alert Service**
        1. Rule Engine
        2. Multi-channel
        3. Escalation
        4. History"]
        ML_SVC["**4.2.5 ML Service**
        1. ET0 Calculation
        2. Kc Optimization
        3. Predictive Model
        4. Anomaly Detect"]
  end
 subgraph CLOUD["**4. CLOUD LAYER - .NET Microservices**"]
    direction TB
        INGRESS["**4.1 Ingress**
        1. Nginx Reverse Proxy
        2. Lets Encrypt SSL
        3. Rate Limit 100 per min
        4. WAF Protection"]
        MICROSERVICES
        EVENT_BUS["**4.3 Event Bus**
        RabbitMQ"]
        REALTIME["**4.4 Real-Time Hub**
        SignalR PLUS Redis"]
        DATA["**4.5 Data Layer**
        1. PostgreSQL 15
        2. TimescaleDB
        3. Redis Cache
        4. MinIO Storage
        5. Elasticsearch"]
  end
 subgraph CLIENT["**5. CLIENT LAYER - MAUI**"]
    direction TB
        MOBILE["**5.1 Mobile App**
        1. Dashboard 10 zones
        2. Zone Detail
        3. Manual Control
        4. Schedule Wizard
        5. Alerts Center
        6. Offline Mode"]
        DESKTOP["**5.2 Desktop App**
        1. Advanced Analytics
        2. Bulk Operations
        3. Report Generator
        4. Firmware Manager
        5. Diagnostics"]
  end
 subgraph EXTERNAL["**6. EXTERNAL**"]
        WEATHER["**6.1 Weather API**"]
        PAYMENT["**6.2 Payment**"]
        NOTIFICATION["**6.3 Notifications**"]
  end
    CORE0 <-- Send Receive --> IPC
    IPC <-- Send Receive --> CORE1
    SENSORS -- I2C Analog --> EDGE
    EDGE -- GPIO PWM --> ACTUATORS
    POWER -- "12V 5V 3.3V" --> EDGE
    RTOS -- Sensor Data --> LOGIC
    LOGIC -- Irrigate Cmd --> STATE
    STATE -- Control --> ACTUATORS
    SAFETY -. Emergency .-> STATE
    SCHEDULER -. Fallback .-> STATE
    EDGE <-- MQTT 1883 8883 --> EDGE_GATEWAY
    EDGE_GATEWAY <-- Bridge --> CLOUD
    COMM <-- "TLS 1.3" --> INGRESS
    INGRESS --> API_GATEWAY
    API_GATEWAY --> IRRIGATION_SVC & DEVICE_SVC
    IRRIGATION_SVC --> EVENT_BUS & DATA
    DEVICE_SVC --> EVENT_BUS & DATA
    EVENT_BUS --> ALERT_SVC & ML_SVC & REALTIME
    ML_SVC --> DATA
    REALTIME <-- WebSocket --> CLIENT
    INGRESS <-- HTTPS --> CLIENT
    ML_SVC <-- REST --> WEATHER
    ALERT_SVC --> NOTIFICATION
    IRRIGATION_SVC -.-> PAYMENT

    style EDGE fill:#BBDEFB
    style CLOUD fill:#FFE0B2
    style CLIENT fill:#FFF9C4
    style EXTERNAL fill:#FFCDD2
    style GATEWAY fill:#C8E6C9
    style HARDWARE fill:#E1BEE7
```

</details>
</details>