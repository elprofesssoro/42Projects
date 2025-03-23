/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-05 09:44:44 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-05 09:44:44 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

int	main(int argc, char **argv)
{
	t_game_data	*game;
	int			a;
	int			b;

	game = (t_game_data *)malloc(sizeof(t_game_data));
	game->mlx = NULL;
	game->map.allocated = 0;
	if (argc != 2)
		ft_error("Wrong amount of arguments were passed.", game);
	if (!ft_strnstr(argv[1], ".ber", ft_strlen(argv[1])))
		ft_error("File extension must be *.ber", game);
	ft_open_map(argv, game);
	ft_check_map(game);
	ft_validate_path(game);
	ft_init_game(game);
	mlx_get_screen_size(game->mlx, &a, &b);
	if (game->map.columns * IMG_W > a || game->map.rows * IMG_H > b)
		ft_error("Map size is bigger than screen size", game);
	ft_draw(game);
	mlx_key_hook(game->win, ft_handle_input, game);
	mlx_hook(game->win, DestroyNotify, ButtonPressMask, ft_close_game, game);
	mlx_loop(game->mlx);
}
