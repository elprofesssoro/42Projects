NAME	=	exec
O		=	obj
SRC		=	Main.cpp \
			Bureaucrat.cpp \
			Form.cpp
INCS	=	Bureaucrat.hpp \
			Form.hpp
OBJ		=	$(SRC:%.cpp=$O/%.o)
CC		=	c++
CFLAGS	=	-Wall -Werror -Wextra -std=c++98

all: $(NAME)

$O:
	@mkdir -p $O

$O/%.o: %.cpp Makefile $(INCS) | $O
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