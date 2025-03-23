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

#include "philo.h"

char	*create_threads(t_program *program, int num)
{
	int	i;

	i = -1;
	if (pthread_create(&program->obeserver, NULL, &monitor, program) != 0)
		return ("Observer thread was not created");
	while (++i < num)
	{
		if (pthread_create(&program->philos[i].thread, NULL,
				&routine, &program->philos[i])
			!= 0)
			return ("Philosopher thread was not created");
	}
	if (pthread_join(program->obeserver, NULL) != 0)
		return ("Observer thread was not joined");
	i = -1;
	while (++i < num)
	{
		if (pthread_join(program->philos[i].thread, NULL) != 0)
			return ("Philosopher thread was not joined");
	}
	return (NULL);
}

void	destroy(char *str, pthread_mutex_t *forks, t_program program, int num)
{
	int	i;

	i = -1;
	if (str)
	{
		write(2, str, ft_strlen(str));
		write(2, "\n", 1);
	}
	pthread_mutex_destroy(&program.dead_lock);
	pthread_mutex_destroy(&program.meal_lock);
	pthread_mutex_destroy(&program.write_lock);
	while (++i < num)
		pthread_mutex_destroy(&forks[i]);
	free(forks);
	free(program.philos);
	exit(0);
}
