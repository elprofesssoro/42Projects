/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   philosophers.h                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-10-15 12:37:52 by idvinov           #+#    #+#             */
/*   Updated: 2024-10-15 12:37:52 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef PHILO_H
# define PHILO_H

# include <unistd.h>
# include <stdio.h>
# include <stdlib.h>
# include <pthread.h>
# include <sys/time.h>

typedef struct philo
{
	pthread_t		thread;
	int				id;
	int				phil_num;
	int				eating;
	int				meals_eaten;
	int				has_eaten;
	int				meal_num;
	size_t			last_meal;
	size_t			time_to_die;
	size_t			time_to_sleep;
	size_t			time_to_eat;
	size_t			start_time;
	int				*dead;
	pthread_mutex_t	*r_fork;
	pthread_mutex_t	*l_fork;
	pthread_mutex_t	*dead_lock;
	pthread_mutex_t	*meal_lock;
	pthread_mutex_t	*write_lock;
}	t_philo;

typedef struct program
{
	pthread_t		obeserver;
	int				dead;
	int				phil_num;
	int				meal_num;
	pthread_mutex_t	dead_lock;
	pthread_mutex_t	meal_lock;
	pthread_mutex_t	write_lock;
	t_philo			*philos;
}	t_program;

void	init_prog(t_program *prog, t_philo *philo, int num, int meal_num);
void	init_fork(pthread_mutex_t *forks, int num);
void	init_philos(t_program *prog, pthread_mutex_t *forks, t_philo *philos);
void	init_philos_arg(t_philo *philos, char **argv, int argc, int *meals);
char	*create_threads(t_program *program, int num);
void	*routine(void *arg);
int		is_dead(t_philo *philo);
void	*monitor(void *arg);
void	print(char *str, t_philo *philo);
size_t	get_current_time(void);
void	destroy(char *str, pthread_mutex_t *forks, t_program program, int num);
int		ft_atoi(char *str);
int		ft_strlen(char *str);
int		ft_usleep(size_t milliseconds);

#endif