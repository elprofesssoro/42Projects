/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_split.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-06-13 13:18:11 by idvinov           #+#    #+#             */
/*   Updated: 2024-06-13 13:18:11 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

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

	size = ft_numsize(n) + 1;
	dst = (char *)malloc((size) * sizeof(char));
	if (!dst)
		return (NULL);
	ft_fill(dst, size, n);
	if (n < 0)
		dst[0] = '-';
	return (dst);
}
