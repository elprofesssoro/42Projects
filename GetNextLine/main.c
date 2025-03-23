/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-04 11:30:43 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-04 11:30:43 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "get_next_line.h"

int main(void)
{
	int fd = open("t.txt", O_RDONLY);
	char *c;
	
		c = get_next_line(fd);
		printf("%s", c);
		c = get_next_line(fd);
		printf("%s", c);
		c = get_next_line(fd);
		printf("%s", c);
		c = get_next_line(fd);
		printf("%s", c);
		c = get_next_line(fd);
		printf("%s", c);

}