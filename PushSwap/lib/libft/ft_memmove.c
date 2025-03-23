/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_memmove.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-06-10 11:54:46 by idvinov           #+#    #+#             */
/*   Updated: 2024-06-10 11:54:46 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

void	*ft_memmove(void *dest, const void *src, size_t n)
{
	char	*ptrd;
	char	*ptrs;
	size_t	i;

	if (dest == NULL && src == NULL)
		return (dest);
	ptrd = (char *)dest;
	ptrs = (char *)src;
	i = -1;
	if (ptrd > ptrs)
	{
		while (n-- > 0)
			ptrd[n] = ptrs[n];
	}
	else
	{
		while (++i < n)
			ptrd[i] = ptrs[i];
	}
	return (dest);
}
