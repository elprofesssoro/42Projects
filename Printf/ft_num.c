/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_num.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-06-27 09:38:32 by idvinov           #+#    #+#             */
/*   Updated: 2024-06-27 09:38:32 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ft_printf.h"

static char	*ft_itoa(int n);
static int	ft_numsize(int n);
static void	ft_fill(char *dst, int size, int n);

void	ft_num(int n, int *count)
{
	char	*str;

	str = ft_itoa(n);
	if (str)
		ft_printstr(str, count);
	free(str);
}

char	*ft_itoa(int n)
{
	char	*dst;
	int		size;

	size = ft_numsize(n) + 1;
	dst = (char *)malloc((size) * sizeof(char));
	if (!dst)
		return (NULL);
	ft_fill(dst, size, n);
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
