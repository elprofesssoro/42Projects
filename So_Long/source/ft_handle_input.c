/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_handle_input.c                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-09 10:57:26 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-09 10:57:26 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

static void	ft_move_player(t_game_data *game, int dX, int dY);

int	ft_handle_input(int keycode, t_game_data *game)
{
	if (keycode == KEY_ESC)
	{
		ft_close_game(game);
	}
	else if (keycode == KEY_W)
	{
		ft_move_player(game, 0, -1);
		game->player.direction = BACK;
	}
	else if (keycode == KEY_S)
	{
		ft_move_player(game, 0, 1);
		game->player.direction = FRONT;
	}
	else if (keycode == KEY_A)
	{
		ft_move_player(game, -1, 0);
		game->player.direction = LEFT;
	}
	else if (keycode == KEY_D)
	{
		ft_move_player(game, 1, 0);
		game->player.direction = RIGHT;
	}
	ft_draw(game);
	return (0);
}

static void	ft_move_player(t_game_data *game, int dX, int dY)
{
	int	x;
	int	y;

	x = game->player.transform.x + dX;
	y = game->player.transform.y + dY;
	if (game->map.map[y][x] == WALL)
		return ;
	game->player.transform.x += dX;
	game->player.transform.y += dY;
	game->steps++;
	if (game->map.map[y][x] == EXIT)
	{
		if (game->map.c_count == 0)
			ft_close_game(game);
	}
	else if (game->map.map[y][x] == COL)
	{
		game->map.c_count--;
		game->map.map[y][x] = FLOOR;
	}
}
