CC := gcc
CFLAGS := -Wall -Wextra -Werror
CLIENT := client.c
SERVER := server.c
CLIENTB := client_bonus.c
SERVERB := server_bonus.c
NAME := client
NAME2 := server
NAMEB := client_bonus
NAME2B := server_bonus

all: ${NAME} ${NAME2}

${NAME}:
	${CC} ${CFLAGS} ${CLIENT} -o ${NAME}

${NAME2}:
	${CC} ${CFLAGS} ${SERVER} -o ${NAME2}

bonus: ${NAMEB} ${NAME2B}

${NAMEB}:
	${CC} ${CFLAGS} ${CLIENTB} -o ${NAMEB}

${NAME2B}:
	${CC} ${CFLAGS} ${SERVERB} -o ${NAME2B}

clean:
	rm -f ${NAME}
	rm -f ${NAME2}
	rm -f ${NAMEB}
	rm -f ${NAME2B}

fclean: clean

re: fclean all

.PHONY: all clean fclean re