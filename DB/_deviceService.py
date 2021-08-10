from DB import Connection
from DB import Device

__all__ = ['DeviceService']


class DeviceService:
    def __init__(self, conn: Connection) -> None:
        self.__conn: Connection = conn

    def queryDev(self) -> list:
        cursor = self.__conn.begin()

        cursor.execute("SELECT * FROM INFODISP")
        table = list(cursor)

        return table

    def countDev(self) -> int:
        cursor = self.__conn.begin()

        cursor.execute("SELECT COUNT(ID) AS QTD FROM INFODISP;")
        count = list(cursor)[0][0]

        return count

    def createDev(self, dev: Device) -> int:

        if self.countDev() < 3:
            cursor = self.__conn.begin()
            sql = """INSERT INTO DISPOSITIVO (HOSTNAME, IPADDR, PORTA, IDCA) VALUES (%s, %s, %s, %s);
                  """

            reg = (dev.hostname,
                   dev.ipAddr,
                   dev.port,
                   dev.channel)

            cursor.execute(sql, reg)
            self.__conn.commit()

            cod_error = 0
        else:
            cod_error = -1

        return cod_error

    def editDev(self, dev: Device) -> None:
        cursor = self.__conn.begin()

        sql = """UPDATE DISPOSITIVO SET HOSTNAME = %s, IPADDR = %s, PORTA = %s, IDCA = %s WHERE IDDIS = %s;
              """

        reg = (dev.hostname,
               dev.ipAddr,
               dev.port,
               dev.channel,
               dev.id)

        cursor.execute(sql, reg)
        self.__conn.commit()

    def remDev(self, dev: Device):
        cursor = self.__conn.begin()
        sql = """ DELETE FROM DISPOSITIVO WHERE IDDIS = %s;
              """

        reg = (dev.id, )

        cursor.execute(sql, reg)
        self.__conn.commit()