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

#include "philo.h"

void	init_prog(t_program *prog, t_philo *philo, int num, int meal_num)
{
	pthread_mutex_init(&prog->dead_lock, NULL);
	pthread_mutex_init(&prog->meal_lock, NULL);
	pthread_mutex_init(&prog->write_lock, NULL);
	prog->philos = philo;
	prog->dead = 0;
	prog->phil_num = num;
	prog->meal_num = meal_num;
}

void	init_fork(pthread_mutex_t *forks, int num)
{
	int	i;

	i = -1;
	while (++i < num)
		pthread_mutex_init(&forks[i], NULL);
}

void	init_philos(t_program *prog, pthread_mutex_t *forks, t_philo *philos)
{
	int	i;

	i = -1;
	while (++i < prog->phil_num)
	{
		philos[i].id = i + 1;
		philos[i].phil_num = prog->phil_num;
		philos[i].eating = 0;
		philos[i].meals_eaten = 0;
		philos[i].dead = &prog->dead;
		philos[i].dead_lock = &prog->dead_lock;
		philos[i].meal_lock = &prog->meal_lock;
		philos[i].write_lock = &prog->write_lock;
		philos[i].start_time = get_current_time();
		philos[i].last_meal = get_current_time();
		philos[i].l_fork = &forks[i];
		philos[i].has_eaten = 0;
		philos[i].meal_num = prog->meal_num;
		if (i == 0)
			philos[i].r_fork = &forks[prog->phil_num - 1];
		else
			philos[i].r_fork = &forks[i - 1];
	}
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
