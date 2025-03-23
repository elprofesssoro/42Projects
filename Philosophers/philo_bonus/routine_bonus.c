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

#include "philo_bonus.h"

static void	eat(t_philo *philo);
static void	ft_sleep(t_philo *philo);
static void	think(t_philo *philo);

void	routine(int id, t_program *program)
{
	t_philo		philo;
	pthread_t	monitort;

	init_philo(program, &philo, id);
	if (philo.phil_num % 2 == 1)
		ft_usleep(1 * philo.id);
	pthread_create(&monitort, NULL, &monitor, &philo);
	while (!is_dead(&philo))
	{
		think(&philo);
		if (is_dead(&philo))
			break ;
		eat(&philo);
		if (is_dead(&philo))
			break ;
		ft_sleep(&philo);
	}
	pthread_join(monitort, NULL);
	cleanup_sems(&philo);
	free(program->processes);
	exit(philo.exit_status);
}

int	is_dead(t_philo *philo)
{
	sem_wait(philo->dead);
	if (philo->dead_flag || philo->exit_status != -1)
	{
		sem_post(philo->dead);
		return (1);
	}
	sem_post(philo->dead);
	return (0);
}

static void	eat(t_philo *philo)
{
	if (philo->phil_num == 1)
		return ;
	sem_wait(philo->eating);
	print("is eating", philo);
	philo->last_meal = get_current_time();
	philo->is_eating = 1;
	philo->meals_eaten++;
	sem_post(philo->eating);
	ft_usleep(philo->time_to_eat);
	sem_wait(philo->eating);
	philo->is_eating = 0;
	sem_post(philo->eating);
	sem_post(philo->forks);
	sem_post(philo->forks);
}

static void	ft_sleep(t_philo *philo)
{
	print("is sleeping", philo);
	ft_usleep(philo->time_to_sleep);
}

static void	think(t_philo *philo)
{
	print("is thinking", philo);
	if (philo->phil_num % 2)
		ft_usleep(1);
	if (is_dead(philo))
		return ;
	sem_wait(philo->forks);
	if (is_dead(philo))
		return ;
	print("has taken a fork", philo);
	if (philo->phil_num == 1)
	{
		ft_usleep(philo->time_to_eat);
		sem_post(philo->forks);
		return ;
	}
	sem_wait(philo->forks);
	if (is_dead(philo))
		return ;
	print("has taken a fork", philo);
}
