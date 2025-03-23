# Compiler
CC := cc
# Compiler flags
CFLAGS := -Wall -Wextra -Werror
# Source files
SRC := ft_printf.c \
	   ft_hex.c \
	   ft_str.c \
	   ft_num.c \
	   ft_unum.c \
# Object files
OBJ := ${SRC:.c=.o}
# Target executable
NAME := libftprintf.a
all: ${NAME}

${NAME}: ${OBJ}
	ar rc ${NAME} ${OBJ};

clean:
	rm -f ${OBJ}

fclean: clean
	rm -f ${NAME}

re: fclean all

.PHONY: all clean fclean re