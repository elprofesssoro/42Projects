/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   thread.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-10-17 10:53:29 by idvinov           #+#    #+#             */
/*   Updated: 2024-10-17 10:53:29 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo_bonus.h"

void	close_sems(t_program *program)
{
	int	i;

	i = -1;
	sem_close(program->has_eaten);
	sem_unlink("/has_eaten");
	sem_close(program->dead);
	sem_unlink("/dead");
	sem_close(program->write);
	sem_unlink("/write");
	sem_close(program->forks);
	sem_unlink("/forks");
	sem_close(program->end);
	sem_unlink("/end");
	free(program->processes);
}

void	reopen_sems(t_philo *philo)
{
	sem_close(philo->has_eaten);
	sem_close(philo->dead);
	sem_close(philo->write);
	sem_close(philo->forks);
	sem_close(philo->end);
	philo->has_eaten = sem_open("/has_eaten", 0);
	philo->write = sem_open("/write", 0);
	philo->dead = sem_open("/dead", 0);
	philo->forks = sem_open("/forks", 0);
	philo->end = sem_open("/end", 0);
}

void	cleanup_sems(t_philo *philo)
{
	if (philo->is_eating)
	{
		sem_post(philo->forks);
		sem_post(philo->forks);
	}
	if (philo->has_eaten)
		sem_close(philo->has_eaten);
	if (philo->dead)
		sem_close(philo->dead);
	if (philo->write)
		sem_close(philo->write);
	if (philo->forks)
		sem_close(philo->forks);
	if (philo->end)
		sem_close(philo->end);
	if (philo->eating)
	{
		sem_close(philo->eating);
		sem_unlink(philo->sem_name);
		free(philo->sem_name);
	}
}
