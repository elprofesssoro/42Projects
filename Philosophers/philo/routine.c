/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   routine.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-10-17 11:07:34 by idvinov           #+#    #+#             */
/*   Updated: 2024-10-17 11:07:34 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo.h"

static void	eat(t_philo *philo);
static void	ft_sleep(t_philo *philo);
static void	think(t_philo *philo);
static void	has_eaten(t_philo *philo);

void	*routine(void *arg)
{
	t_philo	*philo;

	philo = (t_philo *) arg;
	if (philo->id % 2 == 0)
		ft_usleep(1);
	while (!is_dead(philo))
	{
		eat(philo);
		if (is_dead(philo))
			break ;
		ft_sleep(philo);
		if (is_dead(philo))
			break ;
		think(philo);
	}
	return (arg);
}

static void	eat(t_philo *philo)
{
	pthread_mutex_lock(philo->r_fork);
	print("has taken a fork", philo);
	if (philo->phil_num == 1)
	{
		ft_usleep(philo->time_to_eat);
		pthread_mutex_unlock(philo->r_fork);
		return ;
	}
	pthread_mutex_lock(philo->l_fork);
	print("has taken a fork", philo);
	pthread_mutex_lock(philo->meal_lock);
	print("is eating", philo);
	philo->eating = 1;
	philo->meals_eaten++;
	has_eaten(philo);
	philo->last_meal = get_current_time();
	pthread_mutex_unlock(philo->meal_lock);
	ft_usleep(philo->time_to_eat);
	philo->eating = 0;
	pthread_mutex_unlock(philo->l_fork);
	pthread_mutex_unlock(philo->r_fork);
}

static void	ft_sleep(t_philo *philo)
{
	print("is sleeping", philo);
	ft_usleep(philo->time_to_sleep);
}

static void	think(t_philo *philo)
{
	print("is thinking", philo);
}

static void	has_eaten(t_philo *philo)
{
	if (philo->meals_eaten == philo->meal_num)
	{
		pthread_mutex_lock(philo->dead_lock);
		philo->has_eaten = 1;
		pthread_mutex_unlock(philo->dead_lock);
	}
}
