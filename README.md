# 🎮 Boolarcade

**Digital marketplace per videogiochi** con activation keys, recensioni e hot deals fino al 50% di sconto.

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-brightgreen) ![Java](https://img.shields.io/badge/Java-25-orange) ![React](https://img.shields.io/badge/React-18-blue) ![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)

---

## 🚀 Quick Start

```bash
## 1. Create database
mysql -u root -p
CREATE DATABASE game_store;

## 2. Configure application.properties
spring.datasource.password=YOUR_PASSWORD

## 3. Start backend
cd backend && ./mvnw spring-boot:run

## 4. Start frontend
cd frontend && npm run dev
```

**Access Points:**

- 🔒 Admin: <http://localhost:8080/admin/games> (admin/123456)
- 🌐 API: <http://localhost:8080/api/games>
- 🔥 Hot Deals: <http://localhost:8080/api/games/hot-deals>

---

## ✨ Features

### Backend (Spring Boot + Thymeleaf)

- ✅ **7 entità** con relazioni M:N e 1:N
- ✅ **Spring Security** custom con DatabaseUserDetails
- ✅ **Admin panel** Thymeleaf per CRUD
- ✅ **REST API** completa per React
- ✅ **Auto-calculations**: rating da reviews, stock dinamico da keys, orderDate con @PrePersist
- ✅ **Validazioni complete** Jakarta Bean Validation (title, publisher, platform name required)
- ✅ **Hot deals** endpoint (sconti fino 50%)

### Frontend (React - WIP)

- 🏠 Homepage con catalogo
- 🔥 Hot deals page
- 📄 Dettaglio gioco + reviews
- 🛒 Carrello e checkout

---

## 🗄️ Database Schema

7 entità: **Game**, **Category**, **Platform**, **Review**, **GameKey**, **Order**, **User/Role**

```txt
User ─1:N─> Review <─N:1─ Game ─M:N─> Category
 │                         │
 │                         └─M:N─> Platform
 │                                   ▲
 └─1:N─> Order ─1:N─> GameKey ─N:1───┘
```

**Sample Data:**

- **111 giochi** - Elder Scrolls, Fallout, Borderlands, Pokemon, Nintendo exclusives, Extraction shooters (Tarkov, Arc Raiders, Marauders), Indie gems
- **265+ game keys** - 2-5 keys per game with stock variety
- **4 piattaforme** - PC, PS5, Xbox Series X, Nintendo Switch
- **18 categorie** - Action, RPG, Horror, Survival, Shooter, Platformer, Roguelike, Sandbox, Indie, **Extraction**...

---

## 🔌 API Endpoints

### Games

```http
GET    /api/games              # Lista tutti i giochi
GET    /api/games/{id}         # Dettaglio gioco
GET    /api/games/hot-deals    # Giochi scontati
POST   /api/games              # Crea gioco (Admin)
PUT    /api/games/{id}         # Aggiorna gioco (Admin)
DELETE /api/games/{id}         # Elimina gioco (Admin)
```

### Reviews

```http
GET    /api/reviews                  # Lista reviews
GET    /api/reviews?gameId={id}      # Reviews per gioco
POST   /api/reviews                  # Crea review (auto-calc rating)
PUT    /api/reviews/{id}             # Aggiorna review
DELETE /api/reviews/{id}             # Elimina review
```

### Orders & More

```http
GET    /api/orders                   # Lista ordini (Admin)
POST   /api/orders                   # Crea ordine (auto-calc price)
GET    /api/categories               # Lista categorie
GET    /api/platforms                # Lista piattaforme
```

**Admin Panel (Thymeleaf):**

- `/admin/games` - CRUD giochi
- `/admin/orders` - Gestione ordini
- `/admin/game-keys` - CRUD activation keys

---

## 🛠️ Tech Stack

| Backend | Frontend | Database | Tools |
|---------|----------|----------|-------|
| Spring Boot 3.5.7 | React 18 | MySQL 8.0 | Maven 3.9.5 |
| Java 25 | Vite 7.2.1 | Hibernate 6.x | Git |
| Thymeleaf | React Router | JPA | Postman |
| Spring Security | Axios | Bean Validation | VS Code |

---

## 💡 Highlights

### Auto-Calculations

- **Average Rating**: Calcolato automaticamente quando aggiungi/modifichi/elimini reviews
- **Total Price**: Calcolato automaticamente applicando sconti su game keys nell'ordine

### Validations

- `discountPercentage`: 0-100%
- `releaseDate`: non futura (@PastOrPresent)
- `rating`: 1-5
- `paymentStatus`: PENDING|COMPLETED|FAILED|REFUNDED

### Test Data

```json
{
  "title": "Portal 2",
  "price": 19.99,
  "discountPercentage": 50,
  "finalPrice": 9.99,
  "averageRating": 4.9
}
```

---

## 🔧 Troubleshooting

**Port 8080 già in uso:**

```bash
## Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Thymeleaf cache:**

```properties
spring.thymeleaf.cache=false  ## Disabilita in development
```

Con `cache=false` → HTML si aggiorna al refresh browser  
Con `cache=true` → Serve restart backend

**MySQL connection failed:**

- Verifica MySQL running: `net start MySQL80`
- Controlla credenziali in `application.properties`
- Verifica DB esista: `SHOW DATABASES;`

---

## 📚 Docs

- [ASSIGNMENT.md](.project-docs/ASSIGNMENT.md) - Assignment originale
- [UPDATED_ARCHITECTURE.md](.project-docs/UPDATED_ARCHITECTURE.md) - Diagrammi dettagliati
- [Game_Store_API.postman_collection.json](Game_Store_API.postman_collection.json) - Postman collection

---

## � Image Usage Disclaimer

All game images, cover art, logos, and promotional materials used in this project are property of their respective copyright holders and publishers. These images are used solely for **educational and demonstration purposes** as part of a portfolio project.

**Rights Reserved:**

- All trademarks, service marks, trade names, trade dress, product names, and logos are property of their respective owners
- Game cover art and promotional images © their respective publishers and developers
- No copyright infringement is intended
- This is a non-commercial educational project

If you are a copyright holder and would like any content removed, please contact the project author.

---

## �👨‍💻 Author

**Leonardo Mocchi** - Progetto Finale di: Corso Boolean Full-Stack Web Development - Specializzazione Java

---

Made with JAVA and REACTjs
