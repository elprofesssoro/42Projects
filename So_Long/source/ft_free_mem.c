/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_free_mem.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-03 13:35:07 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-03 13:35:07 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

void	ft_free_mem(t_game_data *game);
void	ft_free_sprites(t_game_data *game);
void	ft_free_map(t_map *map);

void	ft_free_mem(t_game_data *game)
{
	if (game->map.allocated)
		ft_free_map(&game->map);
	if (game->mlx == NULL)
	{
		free(game);
		return ;
	}
	ft_free_sprites(game);
	mlx_destroy_window(game->mlx, game->win);
	mlx_destroy_display(game->mlx);
	free(game->mlx);
	free(game);
}

void	ft_free_sprites(t_game_data *game)
{
	mlx_destroy_image(game->mlx, game->wall.img.img);
	mlx_destroy_image(game->mlx, game->floor.img.img);
	mlx_destroy_image(game->mlx, game->collectible.img.img);
	mlx_destroy_image(game->mlx, game->o_exit.img.img);
	mlx_destroy_image(game->mlx, game->c_exit.img.img);
	mlx_destroy_image(game->mlx, game->player.back.img);
	mlx_destroy_image(game->mlx, game->player.front.img);
	mlx_destroy_image(game->mlx, game->player.left.img);
	mlx_destroy_image(game->mlx, game->player.right.img);
}

void	ft_free_map(t_map *map)
{
	int	row;

	row = 0;
	while (row < map->rows)
	{
		free(map->map[row]);
		row++;
	}
	free(map->map);
}
