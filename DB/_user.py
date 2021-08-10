from hashlib import sha512


__all__ = ['User']


class User:
    def __init__(self, id: str = '', name: str = '', lastname: str = '', login: str = '', password: str = '',
                                                                        group: str = '', status: str = '') -> None:
        self.__id: int = int(id) if id != '' else -1
        self.__name: str = name
        self.__lastname: str = lastname
        self.__login: str = login
        self.__password: str = sha512(password.encode()).hexdigest() if password != '' else ''
        self.__group: int = int(group) if group != '' else -1
        self.__status: int = int(status) if status != '' else -1

    @property
    def id(self) -> int:
        return self.__id

    @property
    def name(self) -> str:
        return self.__name

    @name.setter
    def name(self, value: str) -> None:
        self.__name = value

    @property
    def lastname(self) -> str:
        return self.__lastname

    @lastname.setter
    def lastname(self, value: str) -> None:
        self.__lastname = value

    @property
    def login(self) -> str:
        return self.__login

    @login.setter
    def login(self, value: str) -> None:
        self.__login = value

    @property
    def password(self) -> str:
        return self.__password

    @password.setter
    def password(self, value: str) -> None:
        self.__password = sha512(value).hexdigest()

    @property
    def group(self) -> int:
        return self.__group

    @group.setter
    def group(self, value: int) -> None:
        self.__group = value

    @property
    def status(self) -> int:
        return self.__status

    @status.setter
    def status(self, value: int) -> None:
        self.__status = value
