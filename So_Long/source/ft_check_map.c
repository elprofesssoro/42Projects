/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   map.c                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-03 11:59:35 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-03 11:59:35 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

static	void	ft_check_rows(t_game_data *game);
static	void	ft_check_columns(t_game_data *game);
static	void	ft_check_content(t_game_data *game);
static	void	ft_print_content(t_game_data *game);

void	ft_check_map(t_game_data *game)
{
	game->map.columns = ft_strlen(game->map.map[0]);
	ft_check_rows(game);
	ft_check_columns(game);
	game->map.s_count = 0;
	game->map.c_count = 0;
	game->map.e_count = 0;
	ft_check_content(game);
}

static	void	ft_check_rows(t_game_data *game)
{
	int		i;

	i = 0;
	while (i < game->map.rows)
	{
		if (game->map.map[i][0] != WALL)
		{
			ft_error("Map is not surrounded by walls {rows}", game);
			break ;
		}
		else if (game->map.map[i][game->map.columns - 1] != WALL)
		{
			ft_error("Map is not surrounded by walls {rows}", game);
			break ;
		}
		i++;
	}
}

static	void	ft_check_columns(t_game_data *game)
{
	int	i;

	i = 0;
	while (i < game->map.columns)
	{
		if (game->map.map[0][i] != WALL)
		{
			ft_error("Map is not surrounded by walls {columns}", game);
			break ;
		}
		else if (game->map.map[game->map.rows - 1][i] != WALL)
		{
			ft_error("Map is not surrounded by walls {columns}", game);
			break ;
		}
		i++;
	}
}

void	ft_check_content(t_game_data *game)
{
	int	i;
	int	j;

	i = -1;
	while (++i < game->map.rows)
	{
		j = -1;
		while (++j < game->map.columns)
		{
			if (game->map.map[i][j] == START)
			{
				game->map.s_count++;
				game->player.transform.x = j;
				game->player.transform.y = i;
			}
			else if (game->map.map[i][j] == COL)
				game->map.c_count++;
			else if (game->map.map[i][j] == EXIT)
				game->map.e_count++;
			else if (game->map.map[i][j] != FLOOR
					&& game->map.map[i][j] != WALL)
				ft_error("Game map must not contain wrong characters", game);
		}
	}
	ft_print_content(game);
}

static void	ft_print_content(t_game_data *game)
{
	if (game->map.s_count != 1)
		ft_error("Game map must contain only one start position (P).", game);
	else if (game->map.e_count != 1)
		ft_error("Game map must contain only one exit (E).", game);
	else if (game->map.c_count < 1)
		ft_error("Game map must contain one or more collectibles (C).", game);
}
