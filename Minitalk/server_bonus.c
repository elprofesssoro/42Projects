/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server_bonus.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-08-12 11:21:48 by idvinov           #+#    #+#             */
/*   Updated: 2024-08-12 11:21:48 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>
#include <stdio.h>
#include <signal.h>
#include <stdlib.h>

static char	*ft_itoa(int n);
static int	ft_numsize(int n);

void	ft_num(int n)
{
	char	*str;
	int		i;

	i = -1;
	str = ft_itoa(n);
	if (str)
	{
		while (str[++i])
			write(1, &(str[i]), 1);
	}
	free(str);
}

char	*ft_itoa(int n)
{
	char		*dst;
	int			size;
	long int	n1;

	size = ft_numsize(n) + 1;
	dst = (char *)malloc((size) * sizeof(char));
	if (!dst)
		return (NULL);
	n1 = n;
	if (n1 < 0)
		n1 *= -1;
	dst[--size] = 0;
	while (--size >= 0)
	{
		dst[size] = n1 % 10 + 48;
		n1 /= 10;
	}
	if (n < 0)
		dst[0] = '-';
	return (dst);
}

static int	ft_numsize(int n)
{
	int	size;

	size = 0;
	if (n <= 0)
		size++;
	while (n != 0)
	{
		size++;
		n /= 10;
	}
	return (size);
}

void	printstr(int signum, siginfo_t *info, void *vp)
{
	static unsigned char		c;
	static unsigned short int	count;

	if (signum == SIGUSR1)
		c |= (1 << (7 - count));
	count++;
	if (count == 8)
	{
		write(1, &c, 1);
		count = 0;
		c = 0;
		kill((int)info->si_pid, SIGUSR2);
	}
	(void)vp;
	kill((int)info->si_pid, SIGUSR1);
}

int	main(void)
{
	struct sigaction	sact;

	ft_num(getpid());
	write(1, "\n", 1);
	sigemptyset(&sact.sa_mask);
	sact.sa_flags = SA_SIGINFO;
	sact.sa_sigaction = printstr;
	sigaction(SIGUSR2, &sact, NULL);
	sigaction(SIGUSR1, &sact, NULL);
	while (1)
		pause();
	return (0);
}
