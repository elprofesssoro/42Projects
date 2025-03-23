NAME = phonebook
I = inc
S = src
O = obj
CC = c++
CFLAGS = -Wall -Wextra -Werror -std=c++98 -I$I
SRCS = $S/Contact.cpp \
	   $S/Main.cpp \
	   $S/PhoneBook.cpp

INC = $I/Contact.hpp \
	   $I/PhoneBook.hpp 
OBJS = $(SRCS:$S/%.cpp=$O/%.o)

all: $(NAME)

$O:
	mkdir -p obj

$O/%.o: $S/%.cpp $(INCS) | $O
	$(CC) $(CFLAGS) -c $< -o $@

$(NAME): $(OBJ)
	$(CC) $(OBJ) -o $(NAME)
	
clean:
	rm -rf $(O)

fclean: clean
	rm -rf $(NAME)

re: fclean all

.PHONY: re fclean clean all