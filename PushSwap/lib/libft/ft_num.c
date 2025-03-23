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

#include "libft.h"

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
