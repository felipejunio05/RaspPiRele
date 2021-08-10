from RPi import GPIO
from ._relay import Relay


GPIO.setwarnings(False) # Desabilita mesagens de aviso.
GPIO.setmode(GPIO.BCM) # Define como serão identificado os pino da placa.
