# CHAPTER 8 - MONGOOSE ODM

## Run
1) Create `.env`:
```
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
DB_NAME=autorent
PORT=3000
```
2) Install & start:
```
npm install
npm run dev
```

## Endpoints
### GET /cars
- Optional query: `?status=AVAILABLE`

### POST /bookings
Body example:
```json
{
  "userId": "<ObjectId>",
  "carId": "<ObjectId>",
  "startDate": "2026-01-22",
  "endDate": "2026-01-25",
  "status": "CONFIRMED"
}
```

## Validation to test with Postman
- `endDate` must be after `startDate` (schema validation)
- `status` only accepts enum values (schema enum)
- Overlap booking returns 409
- `totalPrice` is auto calculated and saved in Booking
- If `status=CONFIRMED`, system auto creates Contract
