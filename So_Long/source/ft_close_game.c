/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_error_handler.c                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-03 13:27:18 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-03 13:27:18 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

void	ft_error(char *message, t_game_data *game)
{
	ft_printf("Error\n%s\n", message);
	ft_free_mem(game);
	exit(0);
}

int	ft_close_game(t_game_data *game)
{
	ft_free_mem(game);
	exit(0);
}
