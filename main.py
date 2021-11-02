# python can interact with a PLC via ethernet port
# import pycomm3

# from pycomm3 import LogixDriver

# with LogixDriver('IP_ADDRESS_HERE') as 

import secrets

def generateFingerprintId():
	bits = secrets.randbits(256)
	bits_hex = hex(bits)
	fingerprintID = bits_hex[2:]

	return fingerprintID

print(generateFingerprintId())
