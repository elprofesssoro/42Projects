NAME			= push_swap

STANDARD_FLAGS 	= -Wall -Werror -Wextra

LIBFT 			= ./lib/libft/libft.a

CFLAGS= -I$(INC) -O3 -I.. -g

CC 				= cc

VALGRIND		= @valgrind --leak-check=full --show-leak-kinds=all \
--track-origins=yes --quiet --tool=memcheck --keep-debuginfo=yes

REMOVE 			= rm -f

SRCS_DIR		= ./source/

SRCS 			= $(addprefix $(SRCS_DIR),\
				main.c \
				peek.c \
				pop.c \
				push.c \
				stack.c \
				swap.c \
				rotate.c \
				reverse.c \
				indexes.c \
				fillb.c \
				sort_three.c \
				position.c \
				cost.c \
				sort.c \
				array.c \
				move.c \
				input_check_utils.c \
				input_check.c \
				utils.c)

OBJ = $(SRC:%.c=%.o)


all:			${LIBFT} ${NAME}

${NAME}: 		
				${CC} ${SRCS} ${LIBFT} ${STANDARD_FLAGS} -o ${NAME}

${LIBFT}:

				make bonus -C lib/libft

clean:
				make clean -C lib/libft

fclean:
				${REMOVE} ${NAME} ${NAME_BONUS}

re:				fclean all


run:			${NAME}
				${VALGRIND} ./${NAME}



.PHONY:			all clean fclean re rebonus valgrind run run_bonus
