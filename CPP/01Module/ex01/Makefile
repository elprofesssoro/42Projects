NAME	=	exec
O		=	obj
SRC		=	main.cpp \
			zombieHorde.cpp \
			Zombie.cpp
INCS	=	Zombie.hpp 
OBJ		=	$(SRC:%.cpp=$O/%.o)
CC		=	c++
CFLAGS	=	-Wall -Werror -Wextra -std=c++98

all: $(NAME)

$O:
	@mkdir -p $O

$O/%.o: %.cpp $(INCS) | $O
	$(CC) $(CFLAGS) -c $< -o $@

$(NAME): $(OBJ)
	$(CC) $(LDFLAGS) $(OBJ) -o $(NAME)

clean:
	rm -rf $O

fclean:	clean
	rm -f $(NAME)

re: fclean all

.PHONY: all clean fclean re