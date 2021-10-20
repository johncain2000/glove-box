const int AirValue = 620;   //you need to replace this value with Value_1
const int WaterValue = 310;  //you need to replace this value with Value_2
int soilMoistureValue = 0;
int soilmoisturepercent=0;

//blink leds based on soil moisture reading
int led1 = 13;
int led2 = 12;

void setup() {
  Serial.begin(9600); // open serial port, set the baud rate to 9600 bps
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
}
void loop() {
//digitalWrite(led1, HIGH);
soilMoistureValue = analogRead(A0);  //put Sensor insert into soil
//Serial.println(soilMoistureValue);
soilmoisturepercent = map(soilMoistureValue, AirValue, WaterValue, 0, 100);
if(soilmoisturepercent >= 100)
{
  Serial.println("100 %");
}
else if(soilmoisturepercent <=0)
{
  Serial.println("0 %");
}
else if(soilmoisturepercent >0 && soilmoisturepercent < 100)
{
  Serial.print(soilmoisturepercent);
  Serial.println("%");
  if(soilmoisturepercent >= 50){
    digitalWrite(led1, LOW);
    digitalWrite(led2, HIGH);
  } else {
    digitalWrite(led1, HIGH);
    digitalWrite(led2, LOW);
  }
  
}
  delay(250);
}

//void loop() {
//  digitalWrite(led1, HIGH);   // turn the LED on (HIGH is the voltage level)
//  delay(100);               // wait for a second
//  digitalWrite(led1, LOW);    // turn the LED off by making the voltage LOW
//  delay(100); 
//  digitalWrite(led2, HIGH);
//  delay(100);
//  digitalWrite(led2, LOW);
//  delay(100);
// }
