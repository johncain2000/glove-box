from pymongo import MongoClient
from decouple import config
from datetime import datetime
import random
import time

CONNECTION_STRING = config("CONNECTION_STRING")

# connect to database
class Database:
	def __init__(self, connection_string, collection_name):
		self.__connection = MongoClient(connection_string)
		self.__database = self.__connection["battery_box"]
		self.__collection = self.__database[collection_name]

		self.stack = []

	def writeToDatabase(self, data, in_range: bool):
		upload_data = {}
		if len(self.stack) != 25:
			self.stack.append({"sensor_reading":data, "in_range":in_range})
		else:
			upload_data = {"time":datetime.now().strftime("%d/%m/%Y %H:%M:%S")}
			for i in range(len(self.stack)):
				upload_data[str(i)] = self.stack[i]
			self.stack.clear()
			return self.__collection.insert_one(upload_data)

class Sensor:
	def __init__(self, sensor_name: str, sensor_range: list, deviation: float, walk_rate: int):
		self.__sensor_name = sensor_name
		self.__sensor_range = sensor_range
		self.__deviation = deviation
		self.__walk_rate = walk_rate
		self.__previous_reading = None

		self.__database_connection = Database(CONNECTION_STRING, sensor_name)

	def generateReading(self):
		# ensure that deviation does not go below 0
		if self.__sensor_range[0] < self.__deviation:
			deviation_range = [0,self.__sensor_range[-1]+self.__deviation]
		else:
			deviation_range = [self.__sensor_range[0]-self.__deviation, self.__sensor_range[-1]+self.__deviation]

		# if this is the first reading, pick a random reading to start with
		if self.__previous_reading == None:
			reading = round(random.uniform(deviation_range[0],deviation_range[-1]), 2)
		else: # else start a random walk based on previous reading
			reading = self.__previous_reading+(random.choice([-1, 1])*round(random.uniform(0, self.__walk_rate), 2))
			if reading < 0:
				reading = 0
		self.__previous_reading = round(reading, 2)

		print(reading)

		print(self.__sensor_range[0])

		if self.__sensor_range[0] <= reading <= self.__sensor_range[-1]:
			in_range = True
		else:
			in_range = False
		print(in_range)
		# write to database
		self.__database_connection.writeToDatabase(reading, in_range)

if __name__ == "__main__":
	OXYGEN = Sensor("oxygen_sensor", [0, 20], 5.0, 2.0)
	HUMIDITY = Sensor("humidity_sensor", [17, 23], 3.0, 1.0)
	TEMPRATURE = Sensor("temprature_sensor", [70, 123], 14, 4.0)

	while True:
		OXYGEN.generateReading()
		HUMIDITY.generateReading()
		TEMPRATURE.generateReading()
		time.sleep(0.5)
