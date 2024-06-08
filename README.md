This program is written in JavaScript.

To run using Docker:
1. Build the Docker image:
    in your bash:
      docker build -t my-node-app .
    

2. Run the Docker container:
    in your bash
      docker run -p 8080:8080 my-node-app
    

I used curl to test the endpoints:
curl -X POST -H "Content-Type: application/json" -d '{
  "retailer": "Target",
  "purchaseDate": "2022-01-01",
  "purchaseTime": "13:01",
  "items": [
    {
      "shortDescription": "Mountain Dew 12PK",
      "price": "6.49"
    },{
      "shortDescription": "Emils Cheese Pizza",
      "price": "12.25"
    },{
      "shortDescription": "Knorr Creamy Chicken",
      "price": "1.26"
}' http://localhost:8081/receipts/process2-PK 12 FL OZ  ",
