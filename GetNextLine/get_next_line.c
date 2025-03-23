/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   get_next_line.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-07-02 09:40:43 by idvinov           #+#    #+#             */
/*   Updated: 2024-07-02 09:40:43 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "get_next_line.h"

static char	*ft_join(char *prev, char *buff, int *hassymb)
{
	char	*temp;

	temp = ft_strjoin(prev, buff, hassymb);
	free(prev);
	return (temp);
}

static char	*ft_readfile(int fd, char *buff)
{
	int		r;
	char	*tempbuff;
	int		hassymb;

	if (!buff)
		buff = (char *) ft_calloc(1, 1);
	tempbuff = (char *) ft_calloc(BUFFER_SIZE + 1, sizeof(char));
	r = -1;
	while (r != 0)
	{
		r = read(fd, tempbuff, BUFFER_SIZE);
		if (r == -1)
		{
			free(tempbuff);
			return (NULL);
		}
		tempbuff[r] = 0;
		hassymb = 0;
		buff = ft_join(buff, tempbuff, &hassymb);
		if (hassymb)
			break ;
	}
	free(tempbuff);
	return (buff);
}

static char	*ft_removeline(char *buffer)
{
	int		i;
	int		j;
	char	*line;

	i = 0;
	while (buffer[i] && buffer[i] != '\n')
		i++;
	if (!buffer[i])
	{
		free(buffer);
		return (NULL);
	}
	line = ft_calloc((ft_strlen(buffer) - i + 1), sizeof(char));
	i++;
	j = 0;
	while (buffer[i])
		line[j++] = buffer[i++];
	free(buffer);
	return (line);
}

static char	*ft_findline(char *str)
{
	int		l;
	int		i;
	char	*temp;

	i = 0;
	l = 0;
	if (!str[i])
		return (NULL);
	while (str[i] && str[i] != '\n')
	{
		i++;
		l++;
	}
	if (str[i] && str[i] == '\n')
		l += 1;
	temp = ft_calloc(l + 1, sizeof(char));
	if (!temp)
		return (NULL);
	i = -1;
	while (++i < l)
		temp[i] = str[i];
	temp[l] = 0;
	return (temp);
}

char	*get_next_line(int fd)
{
	static char	*buff = NULL;
	char		*line;

	if (fd < 0 || BUFFER_SIZE <= 0 || read(fd, 0, 0) < 0)
	{
		if (buff)
			ft_bzero(buff, ft_strlen(buff));
		return (NULL);
	}
	buff = ft_readfile(fd, buff);
	if (!buff)
		return (NULL);
	line = ft_findline(buff);
	buff = ft_removeline(buff);
	return (line);
}
