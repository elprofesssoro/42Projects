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

#ifndef PHILO_BONUS_H
# define PHILO_BONUS_H

# include <unistd.h>
# include <stdio.h>
# include <stdlib.h>
# include <pthread.h>
# include <sys/time.h>
# include <semaphore.h>
# include <fcntl.h>
# include <sys/wait.h>
# include <signal.h>

typedef struct philo
{
	pid_t	process;
	int		id;
	int		phil_num;
	int		meal_num;
	int		meals_eaten;
	int		dead_flag;
	char	*sem_name;
	char	*dead_name;
	int		is_eating;
	int		exit_status;
	size_t	last_meal;
	size_t	time_to_die;
	size_t	time_to_sleep;
	size_t	time_to_eat;
	size_t	start_time;
	sem_t	*forks;
	sem_t	*dead;
	sem_t	*has_eaten;
	sem_t	*write;
	sem_t	*eating;
	sem_t	*end;
}	t_philo;

typedef struct program
{
	pthread_t	obeserver_m;
	pthread_t	obeserver_d;
	size_t		time_to_die;
	size_t		time_to_sleep;
	size_t		time_to_eat;
	size_t		start_time;
	pid_t		*processes;
	sem_t		*forks;
	sem_t		*dead;
	sem_t		*has_eaten;
	sem_t		*write;
	sem_t		*end;
	int			phil_num;
	int			meal_num;
	int			flag;
	t_philo		*philos;
}	t_program;

void	init_prog(t_program *prog, char **argv, int argc);
void	init_fork(pthread_mutex_t *forks, int num);
void	init_philo(t_program *prog, t_philo *philo, int pid);
void	init_philos_arg(t_philo *philos, char **argv, int argc, int *meals);
char	*create_threads(t_program *program, int num);
void	routine(int id, t_program *program);
int		is_dead(t_philo *philo);
void	*monitor(void *arg);
void	death_observe(void *arg);
void	*meal_observe(void *arg);
int		check_ate(t_philo *philo, int meal_num);
void	cleanup_sems(t_philo *philo);
void	reopen_sems(t_philo *philo);
void	print(char *str, t_philo *philo);
size_t	get_current_time(void);
void	close_sems(t_program *program);
int		ft_atoi(char *str);
int		ft_strlen(char *str);
int		ft_usleep(size_t milliseconds);
char	*ft_itoa(int n);
char	*ft_strjoin(char *s1, char *s2);

#endif