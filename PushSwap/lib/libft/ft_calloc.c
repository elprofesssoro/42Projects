/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_calloc.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-06-11 12:38:44 by idvinov           #+#    #+#             */
/*   Updated: 2024-06-11 12:38:44 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

void	*ft_calloc(size_t nmemb, size_t size)
{
	unsigned char	*p;
	size_t			i;

	i = 0;
	p = malloc(nmemb * size);
	if (!p)
		return (NULL);
	while (i < nmemb * size)
		p[i++] = 0;
	return (p);
}
