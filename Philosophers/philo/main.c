/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-10-15 12:26:56 by idvinov           #+#    #+#             */
/*   Updated: 2024-10-15 12:26:56 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo.h"

static int	check_str(char *str)
{
	int	i;

	i = -1;
	while (str[++i])
	{
		if (str[i] < '0' && str[i] > '9')
			return (0);
	}
	return (1);
}

static int	validate_argv(char **argv, int argc)
{
	if (ft_atoi(argv[1]) <= 0 || !check_str(argv[1]))
		return (write(2, "Invalid number of philosophers.\n", 32), 0);
	if (ft_atoi(argv[2]) <= 0 || !check_str(argv[2]))
		return (write(2, "Invalid time to die.\n", 20), 0);
	if (ft_atoi(argv[3]) <= 0 || !check_str(argv[3]))
		return (write(2, "Invalid time to eat.\n", 20), 0);
	if (ft_atoi(argv[4]) <= 0 || !check_str(argv[4]))
		return (write(2, "Invalid time to sleep.\n", 23), 0);
	if (argc == 6 && (ft_atoi(argv[5]) <= 0 || !check_str(argv[5])))
		return (write(2, "Invalid num_times to eat.\n", 26), 0);
	return (1);
}

int	main(int argc, char **argv)
{
	char			*message;
	int				num;
	t_program		program;
	t_philo			*philos;
	pthread_mutex_t	*forks;

	if (argc < 5 || argc > 6)
		return (write(2, "Invalid input.\n", 16), 0);
	if (!validate_argv(argv, argc))
		return (0);
	num = ft_atoi(argv[1]);
	philos = (t_philo *) malloc(num * sizeof(t_philo));
	forks = (pthread_mutex_t *) malloc(num * sizeof(pthread_mutex_t));
	if (argc == 6)
		init_prog(&program, philos, num, ft_atoi(argv[5]));
	else
		init_prog(&program, philos, num, -1);
	init_fork(forks, num);
	init_philos(&program, forks, philos);
	init_philos_arg(philos, argv, argc, &program.meal_num);
	message = create_threads(&program, num);
	if (message != NULL)
		destroy(message, forks, program, program.phil_num);
	destroy(NULL, forks, program, program.phil_num);
}
