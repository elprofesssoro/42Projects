NAME	=	exec
O		=	obj
I       =   inc
S		=	src
SRC		=	Main.cpp \
			$S/Base.cpp \
			$S/A.cpp \
			$S/B.cpp \
			$S/C.cpp
INCS	=	$I/Base.hpp \
			$I/A.hpp \
			$I/B.hpp \
			$I/C.hpp
OBJ		=	$(SRC:$S/%.cpp=$O/%.o)
CC		=	c++
CFLAGS	=	-Wall -Werror -Wextra -std=c++98 -I$I

all: $(NAME)

$O:
	@mkdir -p $O

$O/%.o: $S/%.cpp Makefile $(INCS) | $O
	$(CC) $(CFLAGS) -c $< -o $@

$(NAME): $(OBJ)
	$(CC) $(OBJ) -o $(NAME)

clean:
	rm -rf $O
	printf "$(YELLOW)$O removed$(END)\n"

fclean:	clean
	rm -f $(NAME)
	printf "$(YELLOW)$(NAME) removed$(END)\n"

re: fclean all

.PHONY: all clean fclean re