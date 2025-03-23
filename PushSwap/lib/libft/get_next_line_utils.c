/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   get_next_line_utils.c                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-07-02 09:41:11 by idvinov           #+#    #+#             */
/*   Updated: 2024-07-02 09:41:11 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

char	*ft_strjoin1(char const *s1, char const *s2, int *hassymb)
{
	char	*dst;
	int		size;
	int		i;
	int		len1;

	if (!s1 || !s2)
		return (NULL);
	len1 = (int) ft_strlen(s1);
	size = len1 + (int) ft_strlen(s2);
	dst = (char *)malloc((size + 1) * sizeof(char));
	if (!dst)
		return (NULL);
	i = 0;
	while (i < size)
	{
		if (i < len1)
			dst[i] = s1[i];
		else
			dst[i] = s2[i - len1];
		if (dst[i] == '\n')
			*hassymb = 1;
		i++;
	}
	dst[i] = 0;
	return (dst);
}
