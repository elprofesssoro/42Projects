NAME	=	exec
O		=	obj
SRC		=	Main.cpp
INCS	=	MutantStack.hpp 
OBJ		=	$(SRC:%.cpp=$O/%.o)
CXX		=	c++
CFLAGS	=	-Wall -Werror -Wextra -std=c++98

all: $(NAME)

$O:
	@mkdir -p $O

$O/%.o: %.cpp Makefile $(INCS) | $O
	$(CXX) $(CFLAGS) -c $< -o $@

$(NAME): $(OBJ)
	$(CXX) $(OBJ) -o $(NAME)

clean:
	rm -rf $O
	printf "$(YELLOW)$O removed$(END)\n"

fclean:	clean
	rm -f $(NAME)
	printf "$(YELLOW)$(NAME) removed$(END)\n"

re: fclean all

.PHONY: all clean fclean re