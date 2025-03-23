/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   init.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-10-15 14:07:33 by idvinov           #+#    #+#             */
/*   Updated: 2024-10-15 14:07:33 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo_bonus.h"

void	init_prog(t_program *prog, char **argv, int argc)
{
	prog->phil_num = ft_atoi(argv[1]);
	if (argc == 6)
		prog->meal_num = ft_atoi(argv[5]);
	else
		prog->meal_num = -1;
	prog->time_to_die = ft_atoi(argv[2]);
	prog->time_to_eat = ft_atoi(argv[3]);
	prog->time_to_sleep = ft_atoi(argv[4]);
	prog->start_time = get_current_time();
	prog->flag = 0;
	prog->has_eaten = sem_open("/has_eaten", O_CREAT | O_EXCL, 0644, 0);
	prog->write = sem_open("/write", O_CREAT | O_EXCL, 0644, 1);
	prog->dead = sem_open("/dead", O_CREAT | O_EXCL, 0644, 1);
	prog->forks = sem_open("/forks", O_CREAT | O_EXCL, 0644, prog->phil_num);
	prog->end = sem_open("/end", O_CREAT | O_EXCL, 0644, 0);
	prog->processes = (pid_t *)malloc((prog->phil_num + 1) * sizeof(pid_t));
}

void	init_philo(t_program *prog, t_philo *philo, int pid)
{
	char	*itoa;

	itoa = ft_itoa(pid);
	philo->sem_name = ft_strjoin("/eating", itoa);
	free(itoa);
	philo->id = pid;
	philo->process = pid;
	philo->phil_num = prog->phil_num;
	philo->meals_eaten = 0;
	philo->dead_flag = 0;
	philo->has_eaten = prog->has_eaten;
	philo->forks = prog->forks;
	philo->write = prog->write;
	philo->dead = prog->dead;
	philo->end = prog->end;
	sem_unlink(philo->sem_name);
	philo->eating = sem_open(philo->sem_name, O_CREAT | O_EXCL, 0644, 1);
	philo->start_time = prog->start_time;
	philo->time_to_eat = prog->time_to_eat;
	philo->time_to_die = prog->time_to_die;
	philo->time_to_sleep = prog->time_to_sleep;
	philo->last_meal = get_current_time();
	philo->meal_num = prog->meal_num;
	philo->is_eating = 0;
	philo->exit_status = -1;
}

void	init_philos_arg(t_philo *philos, char **argv, int argc, int *meals)
{
	int	i;

	i = -1;
	if (argc == 6)
		*meals = ft_atoi(argv[5]);
	while (++i < philos[0].phil_num)
	{
		philos[i].time_to_die = ft_atoi(argv[2]);
		philos[i].time_to_eat = ft_atoi(argv[3]);
		philos[i].time_to_sleep = ft_atoi(argv[4]);
	}
}
