/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   monitor.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-10-17 12:10:31 by idvinov           #+#    #+#             */
/*   Updated: 2024-10-17 12:10:31 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo.h"

static int	check_all_ate(t_philo *philos, int num, int meal_num);
static int	check_someone_dead(t_philo *philos, int num);
static int	check_dead(t_philo *philos);

void	*monitor(void *arg)
{
	t_program	*program;

	program = (t_program *) arg;
	while (!check_someone_dead(program->philos, program->phil_num))
	{
		if (check_all_ate(program->philos, program->phil_num,
				program->meal_num))
			break ;
	}
	pthread_mutex_lock(&program->dead_lock);
	program->dead = 1;
	pthread_mutex_unlock(&program->dead_lock);
	return (arg);
}

static int	check_all_ate(t_philo *philos, int num, int meal_num)
{
	int	i;
	int	phil_eaten;

	i = -1;
	phil_eaten = 0;
	if (meal_num == -1)
		return (0);
	while (++i < num)
	{
		pthread_mutex_lock(philos[i].meal_lock);
		if (philos[i].meals_eaten >= meal_num)
			phil_eaten++;
		pthread_mutex_unlock(philos[i].meal_lock);
	}
	if (phil_eaten == num)
		return (1);
	return (0);
}

int	is_dead(t_philo *philo)
{
	pthread_mutex_lock(philo->dead_lock);
	if (*philo->dead || philo->has_eaten)
	{
		pthread_mutex_unlock(philo->dead_lock);
		return (1);
	}
	pthread_mutex_unlock(philo->dead_lock);
	return (0);
}

static int	check_someone_dead(t_philo *philos, int num)
{
	int	i;

	i = -1;
	while (++i < num)
	{
		if (check_dead(&philos[i]))
		{
			print("died", &philos[i]);
			return (1);
		}
	}
	return (0);
}

static int	check_dead(t_philo *philos)
{
	pthread_mutex_lock(philos->meal_lock);
	if (get_current_time() - philos->last_meal >= philos->time_to_die
		&& philos->eating == 0)
	{
		pthread_mutex_unlock(philos->meal_lock);
		return (1);
	}
	pthread_mutex_unlock(philos->meal_lock);
	return (0);
}
