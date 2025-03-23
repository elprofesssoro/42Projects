/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_itoa.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-10-30 12:28:38 by idvinov           #+#    #+#             */
/*   Updated: 2024-10-30 12:28:38 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo_bonus.h"

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

static void	ft_fill(char *dst, int size, int n)
{
	long int	n1;

	n1 = n;
	if (n1 < 0)
		n1 *= -1;
	dst[--size] = 0;
	while (--size >= 0)
	{
		dst[size] = n1 % 10 + 48;
		n1 /= 10;
	}
}

char	*ft_itoa(int n)
{
	char	*dst;
	int		size;

	size = ft_numsize(n);
	dst = (char *)malloc((size + 1) * sizeof(char));
	if (!dst)
		return (NULL);
	ft_fill(dst, size, n);
	if (n < 0)
		dst[0] = '-';
	dst[size] = '\0';
	return (dst);
}

char	*ft_strjoin(char *s1, char *s2)
{
	char	*dst;
	int		size;
	int		i;

	size = ft_strlen(s1) + ft_strlen(s2);
	dst = (char *)malloc((size + 1) * sizeof(char));
	if (!dst)
		return (NULL);
	i = 0;
	while (i < size)
	{
		if (i < (int)ft_strlen(s1))
			dst[i] = s1[i];
		else
			dst[i] = s2[i - (int)ft_strlen(s1)];
		i++;
	}
	dst[size] = 0;
	return (dst);
}
