/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_draw_map.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-05 12:49:12 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-05 12:49:12 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"
#include <stdio.h>

static void	ft_check_cell(t_game_data *game, int x, int y);
static void	ft_draw_sprite(t_game_data *game, t_img_data img, int x, int y);
static void	ft_draw_player(t_game_data *game);
static void	ft_draw_steps(t_game_data *game);

int	ft_draw(t_game_data *game)
{
	int	y;
	int	x;

	y = 0;
	while (y < game->map.rows)
	{
		x = 0;
		while (x < game->map.columns)
		{
			ft_check_cell(game, x, y);
			x++;
		}
		y++;
	}
	ft_draw_steps(game);
	ft_draw_player(game);
	return (0);
}

static void	ft_draw_player(t_game_data *game)
{
	t_img_data	img;
	int			x;
	int			y;

	img = game->player.front;
	x = game->player.transform.x;
	y = game->player.transform.y;
	if (game->player.direction == BACK)
		img = game->player.back;
	else if (game->player.direction == RIGHT)
		img = game->player.right;
	else if (game->player.direction == LEFT)
		img = game->player.left;
	ft_draw_sprite(game, img, x, y);
}

static void	ft_check_cell(t_game_data *game, int x, int y)
{
	if (game->map.map[y][x] == WALL)
		ft_draw_sprite(game, game->wall.img, x, y);
	else if (game->map.map[y][x] == FLOOR ||
		game->map.map[y][x] == START)
		ft_draw_sprite(game, game->floor.img, x, y);
	else if (game->map.map[y][x] == COL)
		ft_draw_sprite(game, game->collectible.img, x, y);
	else if (game->map.map[y][x] == EXIT)
	{
		if (game->map.c_count > 0)
			ft_draw_sprite(game, game->c_exit.img, x, y);
		else
			ft_draw_sprite(game, game->o_exit.img, x, y);
	}
}

static void	ft_draw_steps(t_game_data *game)
{
	char	*text;

	text = ft_itoa(game->steps);
	if (text == NULL)
		return ;
	mlx_string_put(game->mlx, game->win,
		game->width - 20, game->height - 20, 0xFFFFFFFF, text);
	free(text);
}

static void	ft_draw_sprite(t_game_data *game, t_img_data img, int x, int y)
{
	int	x1;
	int	y1;

	x1 = x * IMG_W;
	y1 = y * IMG_H;
	mlx_put_image_to_window(game->mlx, game->win, img.img, x1, y1);
}
