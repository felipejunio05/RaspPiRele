import sys
import os

BASE = "/var/www/rele"

sys.path.insert(0, BASE)
os.chdir(BASE)

from relayApp import app as application
