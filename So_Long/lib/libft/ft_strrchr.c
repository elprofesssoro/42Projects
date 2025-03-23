/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strrchr.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-06-11 09:48:59 by idvinov           #+#    #+#             */
/*   Updated: 2024-06-11 09:48:59 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

char	*ft_strrchr(const char *s, int c)
{
	char	*ptr;
	char	*occ;

	if (!*s && !c)
		return ((char *)s);
	ptr = (char *)s;
	occ = NULL;
	while (*ptr)
	{
		if (*ptr == (char) c)
			occ = ptr;
		ptr++;
	}
	if (*ptr == (char) c)
		occ = ptr;
	return (occ);
}
