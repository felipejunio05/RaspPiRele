from DB import Connection

__all__ = ['Authentication']


class Authentication:
    def __init__(self, login: str, password: str, conn: Connection) -> None:
        self.__login: str = login
        self.__password: str = password
        self.__conn: Connection = conn

    def login(self) -> dict:
        query = """
                SELECT
                    IDUSR, IDGR, IDST
                FROM
                    USUARIO
                WHERE
                    LOGIN = %s AND SENHA = %s
        """

        try:
            cursor = self.__conn.begin()
            cursor.execute(query, (self.__login, self.__password))
            session = list(cursor)

            if len(session) > 0:
                session = session[0]
            else:
                session = []

            if len(session) > 0 and session[2] == 1:
                session = {'id': session[0], 'group': session[1], 'status': session[2], 'auth': True}
            elif len(session) > 0 and session[2] == 2:
                session = {'id': session[0], 'group': session[1], 'status': session[2], 'auth': False}
            else:
                session = {'id': None, 'group': None, 'status': None, 'auth': False}

        except Exception as Error:
            session = {'id': None, 'group': None, 'status': None, 'auth': False}

        return session
