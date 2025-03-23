/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   client.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-08-06 09:39:58 by idvinov           #+#    #+#             */
/*   Updated: 2024-08-06 09:39:58 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>
#include <stdio.h>
#include <signal.h>

static volatile sig_atomic_t	g_sig_num = 0;

int	ft_atoi(const char *nptr)
{
	int		i;
	int		sign;
	char	*n;

	i = 0;
	sign = 1;
	n = (char *)nptr;
	while (*n)
	{
		i = i * 10 + (*n - 48);
		n++;
	}
	return (i * sign);
}

void	cont(int signum)
{
	g_sig_num = signum;
}

void	sendchar(int pid, unsigned char c)
{
	int	i;

	i = 7;
	while (i >= 0)
	{
		if ((c >> i) & 1)
			kill(pid, SIGUSR1);
		else
			kill(pid, SIGUSR2);
		--i;
		while (g_sig_num != SIGUSR1)
		{
		}
		g_sig_num = 0;
	}
}

int	main(int argc, char **argv)
{
	int					pid;

	if (argc != 3)
	{
		write(1, "Wrong arguments\n", 15);
		return (0);
	}
	pid = ft_atoi(argv[1]);
	signal(SIGUSR1, cont);
	while (*argv[2])
	{
		sendchar(pid, *argv[2]);
		argv[2]++;
	}
	sendchar(pid, '\n');
	return (0);
}
