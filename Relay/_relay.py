from Relay import GPIO
from time import sleep

__all__ = ['Relay']


class Relay:

    def __init__(self):
        self.__channels: list = [26, 20, 21]

    def action(self, ch: int, slp: int = 1) -> None:
        """
            executa ação de ligar e desligar o canal.

            :param ch: Define o canal no qual a ação será executada.
            :type ch: int
            :param slp: Define o tempo em segundos para convergência entre o estado ligado para desligado
            :type slp: int
        """

        self.__validation(ch)

        GPIO.setmode(GPIO.BCM)

        GPIO.setup(self.__channels[ch - 1], GPIO.OUT)
        GPIO.output(self.__channels[ch - 1], GPIO.LOW)

        sleep(slp)

        GPIO.output(self.__channels[ch - 1], GPIO.HIGH)

    def status(self, ch: int) -> int:
        """
            Verifica o estado do canal


            :param ch: Define o canal a ser verificado.
            :type ch: int
            :return: Retorna 1 para ligado e 0 para desligado.
            :rtype: int
        """

        return GPIO.input(self.__channels[ch - 1])

    def reset(self, ch: int) -> None:
        """
            Retorna o canal para o estado desligado.

            :param: ch (int): Define o canal a ser resetado.
        """

        GPIO.output(self.__channels[ch - 1], GPIO.HIGH)

    @staticmethod
    def __validation(value: int) -> None:
        if not value >= 1 and value <= 3:
            raise ValueError("O relé possui somente 3 canais!")
