/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_open_map.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-04 11:53:28 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-04 11:53:28 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

static char	*ft_split_map(int *fd, t_game_data *game)
{
	char	*map_temp;
	char	*line;
	char	*c;

	map_temp = ft_strdup("");
	if (*fd == -1)
	{
		free(map_temp);
		ft_error("Map could not be opened.", game);
	}
	while (1)
	{
		line = get_next_line(*fd);
		if (line == NULL)
			break ;
		c = map_temp;
		map_temp = ft_strjoin(c, line);
		game->map.rows++;
		free(c);
		free(line);
	}
	return (map_temp);
}

void	ft_open_map(char **argv, t_game_data *game)
{
	char	*map_temp;
	int		fd;
	char	*c;
	int		a;
	int		b;

	fd = open(argv[1], O_RDONLY);
	game->map.rows = 0;
	a = 0;
	b = 0;
	map_temp = ft_split_map(&fd, game);
	c = map_temp;
	map_temp = ft_strjoin(c, "\n");
	free(c);
	if (ft_strlen(map_temp) % game->map.rows != 0)
	{
		free(map_temp);
		ft_error("Map is not rectangular", game);
	}
	game->map.map = ft_split(map_temp, '\n');
	free(map_temp);
	game->map.allocated = 1;
}
