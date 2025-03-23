/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strtrim.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-06-13 10:03:19 by idvinov           #+#    #+#             */
/*   Updated: 2024-06-13 10:03:19 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

static	char	*ft_createstr(char *str, size_t start, size_t len);

static	int	ft_istrim(char c, char const *set);

char	*ft_strtrim(char const *s1, char const *set)
{
	size_t	i;
	size_t	j;

	if (ft_strlen(s1) == 0)
		return (ft_strdup(""));
	i = 0;
	j = ft_strlen(s1) - 1;
	while (ft_istrim(s1[i], set))
		i++;
	while (ft_istrim(s1[j], set))
		j--;
	return (ft_createstr((char *)s1, i, j - (i - 1)));
}

static char	*ft_createstr(char *str, size_t start, size_t len)
{
	char	*dst;
	size_t	i;

	if (!str)
		return (NULL);
	if (len <= 0 || start >= ft_strlen(str))
		return (ft_strdup(""));
	dst = (char *) malloc((len + 1) * sizeof(char));
	if (!dst)
		return (NULL);
	i = 0;
	while (i < len)
	{
		dst[i] = str[start + i];
		i++;
	}
	dst[i] = 0;
	return (dst);
}

static int	ft_istrim(char c, char const *set)
{
	int	i;

	i = -1;
	while (set[++i])
	{
		if (set[i] == c)
			return (1);
	}
	return (0);
}
