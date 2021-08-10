from DB import Connection
from DB import User

__all__ = ['UserService']


class UserService:
    def __init__(self, conn: Connection) -> None:
        self.__conn: Connection = conn

    def queryUser(self) -> list:
        cursor = self.__conn.begin()

        cursor.execute("SELECT * FROM INFOUSR")
        table = list(cursor)

        return table

    def countUser(self) -> list:
        cursor = self.__conn.begin()

        cursor.execute("SELECT COUNT(ID) AS QTD FROM INFOUSR;")
        count = list(cursor)[0][0]

        return count

    def createUser(self, user: User) -> None:
        cursor = self.__conn.begin()

        sql = """
                INSERT INTO USUARIO (NOME, LOGIN, SENHA, IDGR, IDST) VALUES (%s, %s, %s, %s, %s)
              """

        reg = (str(user.name + " " + user.lastname).strip(),
               user.login,
               user.password,
               user.group,
               user.status)

        cursor.execute(sql, reg)
        self.__conn.commit()

    def editUser(self, user: User) -> None:
        cursor = self.__conn.begin()

        sql = """
                UPDATE USUARIO SET NOME = %s, LOGIN = %s, IDGR = %s, IDST = %s WHERE IDUSR = %s;
              """

        reg = (str(user.name + " " + user.lastname).strip(),
               user.login,
               user.group,
               user.status,
               user.id)

        cursor.execute(sql, reg)
        self.__conn.commit()

    def changePswd(self, user: User) -> None:
        cursor = self.__conn.begin()

        sql = """
                UPDATE USUARIO SET SENHA = %s WHERE IDUSR = %s;
              """

        reg = (user.password, user.id)

        cursor.execute(sql, reg)
        self.__conn.commit()

    def remUser(self, user: User):
        cursor = self.__conn.begin()
        sql = """ DELETE FROM USUARIO WHERE IDUSR = %s;
              """

        reg = (user.id, )

        cursor.execute(sql, reg)
        self.__conn.commit()
