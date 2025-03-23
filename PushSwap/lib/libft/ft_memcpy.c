/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_memcpy.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-06-10 10:54:08 by idvinov           #+#    #+#             */
/*   Updated: 2024-06-10 10:54:08 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

void	*ft_memcpy(void *dest, const void *src, size_t n)
{
	unsigned char	*ptrd;
	unsigned char	*ptrs;

	if (dest == NULL && src == NULL)
		return (NULL);
	ptrd = (unsigned char *)dest;
	ptrs = (unsigned char *)src;
	while (n-- > 0)
	{
		*ptrd = *ptrs;
		ptrd++;
		ptrs++;
	}
	return (dest);
}
