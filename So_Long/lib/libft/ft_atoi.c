/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_atoi.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-06-11 12:00:24 by idvinov           #+#    #+#             */
/*   Updated: 2024-06-11 12:00:24 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

static int	ft_isspace(int c);

int	ft_atoi(const char *nptr)
{
	int		i;
	int		sign;
	char	*n;

	i = 0;
	sign = 1;
	n = (char *)nptr;
	while (ft_isspace(*n))
		n++;
	if (*n == '-' || *n == '+')
	{
		if (*n == '-')
			sign *= -1;
		n++;
	}
	while (*n && ft_isdigit(*n))
	{
		i = i * 10 + (*n - 48);
		n++;
	}
	return (i * sign);
}

static int	ft_isspace(int c)
{
	if (c == 9 || c == 10 || c == 11 || c == 12 || c == 13 || c == 32)
		return (1);
	return (0);
}
