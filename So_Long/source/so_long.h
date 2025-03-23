/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   so_long.h                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-03 12:01:33 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-03 12:01:33 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef SO_LONG_H
# define SO_LONG_H

# include <X11/X.h>
# include <X11/keysym.h>
# include <mlx.h>

# include "../lib/libft/libft.h"

# define IMG_H	32
# define IMG_W	32

# define WALL	'1'
# define FLOOR	'0'
# define COL	'C'
# define EXIT	'E'
# define START	'P'

# define FRONT	0
# define BACK	1
# define LEFT	2
# define RIGHT	3

# define KEY_W	119
# define KEY_A	97
# define KEY_S	115
# define KEY_D	100

# define KEY_ESC  	65307

typedef struct img_data
{
	void	*img;
	int		width;
	int		height;
}	t_img_data;

typedef struct transform
{
	int	x;
	int	y;
}	t_transform;

typedef struct obj
{
	t_img_data	img;
	t_transform	transform;
}	t_obj;

typedef struct map
{
	char	**map;
	int		rows;
	int		columns;
	int		s_count;
	int		c_count;
	int		e_count;
	int		allocated;
}	t_map;

typedef struct player
{
	t_img_data	back;
	t_img_data	front;
	t_img_data	left;
	t_img_data	right;
	t_transform	transform;
	int			direction;
}	t_player;

typedef struct game_data
{
	void		*mlx;
	void		*win;
	int			width;
	int			height;
	t_map		map;
	t_player	player;
	t_obj		collectible;
	t_obj		o_exit;
	t_obj		c_exit;
	t_obj		wall;
	t_obj		floor;
	int			steps;
}	t_game_data;

void	ft_open_map(char **argv, t_game_data *game);
char	*ft_check_arg(int argc, char **argv);
void	ft_error(char *message, t_game_data *game);
void	ft_free_mem(t_game_data *game);
void	ft_free_sprites(t_game_data *game);
void	ft_free_map(t_map *map);
void	ft_check_map(t_game_data *game);
void	ft_init_game(t_game_data *game);
int		ft_draw(t_game_data *game);
int		ft_handle_input(int keycode, t_game_data *game);
int		ft_close_game(t_game_data *game);
void	ft_validate_path(t_game_data *game);

#endif