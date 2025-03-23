/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_split.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-06-14 09:41:08 by idvinov           #+#    #+#             */
/*   Updated: 2024-06-14 09:41:08 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

static int	ft_wordcount(const char *s, char c)
{
	int		count;
	int		l;

	count = 0;
	l = 0;
	while (*s)
	{
		if (*s != c && l == 0)
		{
			l = 1;
			count++;
		}
		else if (*s == c)
			l = 0;
		s++;
	}
	return (count);
}

static char	*ft_fillword(const char *s, int start, int end)
{
	char	*word;
	int		i;

	word = (char *)malloc((end - start + 1) * sizeof(char));
	if (!word)
		return (NULL);
	i = 0;
	while (start < end)
	{
		word[i] = s[start];
		i++;
		start++;
	}
	word[i] = 0;
	return (word);
}

static void	*ft_free(char **s, int index)
{
	int	i;

	i = -1;
	while (++i < index)
		free(s[i]);
	free(s);
	return (NULL);
}

static	int	ft_init(char const *s, size_t *i, int *wordcount, int *wordindex)
{
	if (!s)
		return (0);
	*i = -1;
	*wordcount = 0;
	*wordindex = -1;
	return (1);
}

char	**ft_split(char const *s, char c)
{
	char	**dst;
	size_t	i;
	int		wordcount;
	int		wordindex;

	if (!ft_init(s, &i, &wordcount, &wordindex))
		return (NULL);
	dst = malloc((ft_wordcount(s, c) + 1) * sizeof(char *));
	if (!dst)
		return (NULL);
	while (++i <= ft_strlen(s))
	{
		if (s[i] != c && wordindex < 0)
			wordindex = i;
		else if ((s[i] == c || i == ft_strlen(s)) && wordindex >= 0)
		{
			dst[wordcount] = ft_fillword(s, wordindex, i);
			if (!dst[wordcount])
				return (ft_free(dst, wordcount));
			wordindex = -1;
			wordcount++;
		}
	}
	dst[wordcount] = 0;
	return (dst);
}
