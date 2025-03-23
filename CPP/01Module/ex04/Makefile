NAME	=	exec
O		=	obj
S		=	src
SRC		=	Main.cpp
OBJ		=	$(SRC:%.cpp=$O/%.o)
CC		=	c++
CFLAGS	=	-Wall -Werror -Wextra -std=c++98

all: $(NAME)

$O:
	@mkdir -p $O

$O/%.o: %.cpp Makefile | $O
	$(CC) $(CFLAGS) -c $< -o $@

$(NAME): $(OBJ)
	$(CC) $(OBJ) -o $(NAME)

clean:
	rm -rf $O

fclean:	clean
	rm -f $(NAME)

re: fclean all

.PHONY: all clean fclean re