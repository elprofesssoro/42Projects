NAME	=	account
O		=	obj
I		=	includes
S		=	source
SRC		=	$S/Account.cpp \
			$S/tests.cpp
INCS	=	$I/Account.hpp
OBJ		=	$(SRC:$S/%.cpp=$O/%.o)
CC		=	c++
CFLAGS	=	-Wall -Werror -Wextra -std=c++98 -I$I

all: $(NAME)

$O:
	@mkdir -p $O

$O/%.o: $S/%.cpp $(INCS) | $O
	$(CC) $(CFLAGS) -c $< -o $@

$(NAME): $(OBJ)
	$(CC) $(OBJ) -o $(NAME)

clean:
	rm -rf $O

fclean:	clean
	rm -f $(NAME)

re: fclean all

.PHONY: all clean fclean re
