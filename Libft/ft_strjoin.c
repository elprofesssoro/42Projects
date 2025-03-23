/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strjoin.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-06-13 09:36:45 by idvinov           #+#    #+#             */
/*   Updated: 2024-06-13 09:36:45 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

char	*ft_strjoin(char const *s1, char const *s2)
{
	char	*dst;
	int		size;
	int		i;

	size = ft_strlen(s1) + ft_strlen(s2);
	dst = (char *)malloc((size) * sizeof(char));
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
	return (dst);
}
