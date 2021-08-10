
__all__ = ['Device']


class Device:
    def __init__(self, id: str = '', hostname: str = '', ipAddr: str = '', port: str = '', channel: str = '') -> None:
        self.__id: int = int(id) if id != '' else -1
        self.__hostname: str = hostname
        self.__ipAddr: str = ipAddr
        self.__port: str = port

        assert channel != ''
        self.__channel: int = int(channel)

    @property
    def id(self) -> int:
        return self.__id

    @property
    def hostname(self) -> str:
        return self.__hostname

    @hostname.setter
    def hostname(self, value: str) -> None:
        self.__hostname = value

    @property
    def ipAddr(self) -> str:
        return self.__ipAddr

    @ipAddr.setter
    def ipAddr(self, value: str) -> None:
        self.__ipAddr = value

    @property
    def port(self) -> str:
        return self.__port

    @port.setter
    def port(self, value: str) -> None:
        self.__port = value

    @property
    def channel(self) -> int:
        return self.__channel

    @channel.setter
    def channel(self, value: str) -> None:
        self.__channel = int(value)
