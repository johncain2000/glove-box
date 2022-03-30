from pymongo import MongoClient
import serial
import time
from datetime import datetime
from decouple import config

# connect to database
class Database:
	def __init__(self, connection_string):
		self.__connection = MongoClient(connection_string)
		self.__database = self.__connection["battery_box"]
		self.__collection = self.__database["sensor_data"]

		self.stack = []

	def writeToDatabase(self, data):
		upload_data = {}
		if len(self.stack) != 25:
			self.stack.append(data)
		else:
			upload_data = {"time":datetime.now().strftime("%d/%m/%Y %H:%M:%S")}
			for i in range(len(self.stack)):
				upload_data[str(i)] = self.stack[i]
			self.stack.clear()
			return self.__collection.insert_one(upload_data)

class Port:
	def __init__(self, port_string, baudrate, timeout):
		self.port_string = port_string
		self.baudrate = baudrate
		self.timeout = timeout

		self.port_object = serial.Serial(self.port_string, baudrate=self.baudrate, timeout=self.timeout)

	def read(self):
		serial_data = self.port_object.readline()
		return serial_data.decode('utf') # normalized


if __name__ == "__main__":
	# load_dotenv(override=False)

	# establish connection to database
	CONNECTION_STRING = config("CONNECTION_STRING")
	
	# serial connection params
	PORT_STRING = config("PORT_STRING")
	BAUDRATE = int(config("BAUDRATE"))
	TIMEOUT = int(config("TIMEOUT"))
	READ_RATE = int(config("READ_RATE"))

	# print(CONNECTION_STRING)

	port = Port(PORT_STRING, baudrate=BAUDRATE, timeout=TIMEOUT)
	db = Database(CONNECTION_STRING)

	while True:
		data = port.read().strip() #removes any weird formatting from serial, such as newline
		# if data in ["", None, "\n"]:
		# 	continue
		# write to database
		print(data)
		db.writeToDatabase(data)
