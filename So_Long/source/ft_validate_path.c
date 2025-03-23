/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_validate_path.c                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-13 09:41:55 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-13 09:41:55 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

static void	ft_flood_fill(char **map, t_transform pos, int *cols, int *exit);
static void	dfs(char **map, t_transform pos, int *cols, int *exit);

void	ft_validate_path(t_game_data *game)
{
	int		c;
	int		e;
	int		i;
	char	**map_temp;

	c = game->map.c_count;
	e = game->map.e_count;
	map_temp = malloc(game->map.rows * sizeof(char *));
	i = -1;
	while (++i < game->map.rows)
		map_temp[i] = ft_strdup(game->map.map[i]);
	ft_flood_fill(map_temp, (t_transform){game->player.transform.x,
		game->player.transform.y}, &c, &e);
	i = -1;
	while (++i < game->map.rows)
		free(map_temp[i]);
	free(map_temp);
	if (c != 0 || e != 0)
		ft_error("Map has invalid path", game);
}

static void	ft_flood_fill(char **map, t_transform pos, int *cols, int *exit)
{
	dfs(map, pos, cols, exit);
}

static void	dfs(char **map, t_transform pos, int *cols, int *exit)
{
	if (map[pos.y][pos.x] == '1')
		return ;
	if (map[pos.y][pos.x] == COL)
		*cols -= 1;
	else if (map[pos.y][pos.x] == EXIT)
		*exit -= 1;
	if (map[pos.y][pos.x] == 'W')
		return ;
	map[pos.y][pos.x] = 'W';
	dfs(map, (t_transform){pos.x - 1, pos.y}, cols, exit);
	dfs(map, (t_transform){pos.x + 1, pos.y}, cols, exit);
	dfs(map, (t_transform){pos.x, pos.y - 1}, cols, exit);
	dfs(map, (t_transform){pos.x, pos.y + 1}, cols, exit);
}
