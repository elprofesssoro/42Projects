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

#include "philo_bonus.h"

static int	check_dead(t_philo *philo);
static void	dead_action(t_philo *philo);
static void	ate_action(t_philo *philo);

void	*monitor(void *arg)
{
	t_philo	*philo;

	philo = (t_philo *) arg;
	if (philo->id % 2)
		ft_usleep(1);
	while (!is_dead(philo))
	{
		if (check_ate(philo, philo->meal_num))
		{
			ate_action(philo);
			break ;
		}
		if (check_dead(philo))
		{
			dead_action(philo);
			break ;
		}
	}
	return (arg);
}

int	check_ate(t_philo *philo, int meal_num)
{
	int	i;
	int	flag;

	i = -1;
	flag = 0;
	if (meal_num == -1)
		return (flag);
	sem_wait(philo->eating);
	if (philo->meals_eaten >= meal_num)
		flag = 1;
	sem_post(philo->eating);
	return (flag);
}

static int	check_dead(t_philo *philos)
{
	sem_wait(philos->eating);
	if (get_current_time() - philos->last_meal >= philos->time_to_die
		&& philos->is_eating == 0)
	{
		sem_post(philos->eating);
		return (1);
	}
	sem_post(philos->eating);
	return (0);
}

static void	dead_action(t_philo *philo)
{
	print("died", philo);
	sem_wait(philo->dead);
	philo->dead_flag = 1;
	philo->exit_status = 1;
	sem_post(philo->dead);
	sem_post(philo->end);
	sem_post(philo->forks);
	sem_post(philo->forks);
}

static void	ate_action(t_philo *philo)
{
	sem_wait(philo->dead);
	philo->dead_flag = 1;
	philo->exit_status = 1;
	sem_post(philo->dead);
	philo->exit_status = 0;
	sem_wait(philo->eating);
	if (philo->is_eating == 1)
	{
		sem_post(philo->forks);
		sem_post(philo->forks);
	}
	sem_post(philo->eating);
}
