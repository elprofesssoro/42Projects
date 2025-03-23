NAME            = philo_exec
B_NAME          = bonus_exec
STANDARD_FLAGS  = -Wall -Werror -Wextra
POSIX           = -lpthread
POSIX_B         = -lpthread -lrt
CFLAGS          = -I$(INC) -O3 -I.. -g
CC              = cc
REMOVE          = rm -f
SRCS_DIR        = ./philo/
B_DIR           = ./philo_bonus/
SRCS            = $(addprefix $(SRCS_DIR),\
                main.c \
                init.c \
                monitor.c \
                thread.c \
                routine.c \
                utils.c)
B_SRCS          = $(addprefix $(B_DIR),\
                main_bonus.c \
                init_bonus.c \
                monitor_bonus.c \
                thread_bonus.c \
                routine_bonus.c \
                utils_bonus.c \
				ft_itoa.c \
				observer_bonus.c)
OBJS            = $(SRCS:.c=.o)
B_OBJS          = $(B_SRCS:.c=.o)
HEADER 			= ./philo/philo.h
B_HEADER 		= ./philo_bonus/philo_bonus.h


all:            philo bonus

philo: ${NAME}

${NAME}: ${SRCS} ${HEADER}
				${CC} ${STANDARD_FLAGS} ${POSIX_B} -o ${NAME} ${SRCS}

bonus:	${B_NAME}
${B_NAME}: ${B_SRCS} ${B_HEADER}
				${CC} ${STANDARD_FLAGS} ${POSIX_B} -o ${B_NAME} ${B_SRCS}

clean:
				${REMOVE} ${OBJS} ${B_OBJS}
fclean: clean
				${REMOVE} ${NAME} ${B_NAME}

re:             fclean all

.PHONY:         all clean fclean re
