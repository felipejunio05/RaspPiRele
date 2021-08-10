from mysql import connector

__all__ = ['Connection']


class Connection:
    def __init__(self):
        self.__host = "localhost"
        self.__user = "rele"
        self.__password = ""
        self.__database = 'appRele'
        self.__connection: connector = self.__conn()

    def begin(self) -> connector:
        if self.__connection.is_connected():
            cursor = self.__connection.cursor()
        else:
            try:
                self.__connection.connect(host=self.__host, user=self.__user, password=self.__password,
                                          database=self.__database)

                cursor = self.__connection.cursor()
            except Exception as Error:
                print(Error)

        return cursor

    def close(self) -> None:
        self.__connection.cursor().close()
        self.__connection.close()

    def commit(self):
        self.__connection.commit()

    def __conn(self) -> connector:

        try:
            self.__connection = connector.connect(host=self.__host, user=self.__user, password=self.__password,
                                                  database=self.__database)
        except Exception as Error:
            print(Error)

        return self.__connection
