/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_init_game.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-05 11:54:46 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-05 11:54:46 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

static	void	ft_init_sprites(t_game_data *game);
static	void	ft_init_variables(t_game_data *game);

static t_img_data	ft_create_sprite(t_game_data *game, char *path)
{
	t_img_data	sprite;

	sprite.img = mlx_xpm_file_to_image(game->mlx, path,
			&sprite.width, &sprite.height);
	if (sprite.img == NULL)
	{
		free(sprite.img);
		ft_error("An error occured while creating image.", game);
	}
	return (sprite);
}

void	ft_init_game(t_game_data *game)
{
	int	w;
	int	h;

	game->mlx = mlx_init();
	if (game->mlx == NULL)
	{
		free(game->mlx);
		ft_error("An error occured while creating MLX pointer.", game);
	}
	ft_init_variables(game);
	w = game->width;
	h = game->height;
	game->win = mlx_new_window(game->mlx, w, h, "Main Game");
	if (game->win == NULL)
	{
		free(game->win);
		ft_error("Window was not created due to the error.", game);
	}
	ft_init_sprites(game);
}

static void	ft_init_sprites(t_game_data *game)
{
	game->wall.img = ft_create_sprite(game, "sprites/wall.xpm");
	game->floor.img = ft_create_sprite(game, "sprites/floor.xpm");
	game->collectible.img = ft_create_sprite(game, "sprites/coin-bag.xpm");
	game->o_exit.img = ft_create_sprite(game, "sprites/open-exit.xpm");
	game->c_exit.img = ft_create_sprite(game, "sprites/exit-closed.xpm");
	game->player.back = ft_create_sprite(game, "sprites/player/back.xpm");
	game->player.front = ft_create_sprite(game, "sprites/player/front.xpm");
	game->player.left = ft_create_sprite(game, "sprites/player/left.xpm");
	game->player.right = ft_create_sprite(game, "sprites/player/right.xpm");
}

static void	ft_init_variables(t_game_data *game)
{
	game->height = game->map.rows * IMG_W;
	game->width = game->map.columns * IMG_H;
	game->player.direction = FRONT;
	game->steps = 0;
}
