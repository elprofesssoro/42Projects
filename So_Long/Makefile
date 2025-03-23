NAME			= so_long

STANDARD_FLAGS 	= -Wall -Werror -Wextra
MINILIBX_FLAGS	= -lmlx -lX11  -lXext

LIBFT 			= ./lib/libft/libft.a

CFLAGS= -I$(INC) -O3 -I.. -g

CC 				= cc

REMOVE 			= rm -f

SRCS_DIR		= ./source/

SRCS 			= $(addprefix $(SRCS_DIR),\
				main.c \
				ft_check_map.c \
				ft_close_game.c \
				ft_free_mem.c \
				ft_open_map.c \
				ft_init_game.c \
				ft_draw.c \
				ft_handle_input.c \
				ft_validate_path.c)

OBJ = $(SRC:%.c=%.o)

all:			${LIBFT} ${NAME}

${NAME}: 		
				${CC} ${SRCS} ${LIBFT} ${STANDARD_FLAGS} ${MINILIBX_FLAGS} -o ${NAME}

${LIBFT}:
				make all-C lib/libft
				make bonus -C lib/libft

clean:
				make clean -C lib/libft

fclean: clean
				${REMOVE} ${NAME} ${NAME_BONUS}

re:				fclean all

.PHONY:			all clean fclean re rebonus valgrind run run_bonus
