/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_unum.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-06-27 10:12:26 by idvinov           #+#    #+#             */
/*   Updated: 2024-06-27 10:12:26 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

static char	*ft_uitoa(unsigned int n);
static int	ft_numsize(unsigned int n);
static void	ft_fill(char *dst, int size, unsigned int n);

void	ft_unum(unsigned int n, int *count)
{
	char	*str;

	str = ft_uitoa(n);
	if (str)
		ft_printstr(str, count);
	free(str);
}

static char	*ft_uitoa(unsigned int n)
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

static int	ft_numsize(unsigned int n)
{
	int	size;

	size = 0;
	if (n == 0)
		size++;
	while (n != 0)
	{
		size++;
		n /= 10;
	}
	return (size);
}

static void	ft_fill(char *dst, int size, unsigned int n)
{
	dst[--size] = 0;
	while (--size >= 0)
	{
		dst[size] = n % 10 + 48;
		n /= 10;
	}
}
