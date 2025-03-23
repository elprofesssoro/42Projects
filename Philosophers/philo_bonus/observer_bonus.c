/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   observer.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-10-31 12:13:28 by idvinov           #+#    #+#             */
/*   Updated: 2024-10-31 12:13:28 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo_bonus.h"

void	*meal_observe(void *arg)
{
	int			i;
	t_program	*program;

	i = 0;
	program = (t_program *) arg;
	if (program->meal_num == -1)
		return (arg);
	while (i < program->phil_num)
	{
		sem_wait(program->has_eaten);
		i++;
	}
	sem_post(program->end);
	return (arg);
}

void	death_observe(void *arg)
{
	int			i;
	t_program	*program;
	int			flag;
	int			j;

	i = -1;
	program = (t_program *) arg;
	flag = -1;
	while (i < program->phil_num)
	{
		waitpid(-1, &flag, 0);
		if (flag == 256)
		{
			j = -1;
			while (++j < program->phil_num)
				kill(program->processes[j], SIGKILL);
			return ;
		}
		i++;
	}
}
