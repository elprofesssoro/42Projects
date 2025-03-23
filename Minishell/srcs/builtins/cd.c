/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cd.c                                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lfabel <lfabel@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/11/28 09:43:09 by lfabel            #+#    #+#             */
/*   Updated: 2025/02/27 15:46:47 by lfabel           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/minishell.h"

static char	*search_home(t_shell *mini);
static int	access_dir(char *direct);
static int	no_dir(char *direct);


int	cderror(char *arg)
{
	ft_putstr_fd("bash: cd: ", 2);
	perror(arg);
	return (1);
}

int	ft_cd(t_token *token, t_shell *mini)
{
	char	*direct;

	if (token->next->next)
	{
		write(2, "cd: too many arguments\n", 24);
		return (1);
	}
	if (token->next == NULL)
	{
		direct = search_home(mini);
		if (!direct)
		{
			write(2, "cd: HOME is not set\n", 21);
			return (1);
		}
	}
	else
		direct = ft_strdup(token->next->str);
	if (!access(direct, F_OK) && access(direct, R_OK) < 0)
		return (access_dir(direct));
	else if (chdir(direct) != 0)
		return (no_dir(direct));
	free (direct);
	return (0);
}

static char	*search_home(t_shell *mini)
{
	t_list	*temp;
	char	*tmp;

	temp = mini->env;
	while (temp)
	{
		if (ft_strncmp(temp->value, "HOME=", 5) == 0)
		{
			tmp = ft_strtrim(temp->value, "HOME=");
			return (tmp);
		}
		temp = temp->next;
	}
	return (NULL);
}

static int	access_dir(char *direct)
{
	ft_putstr_fd("cd: permission denied ", STDERR);
	ft_putstr_fd(direct, STDERR);
	ft_putchar_fd('\n', STDERR);
	free (direct);
	return (1);
}

static int	no_dir(char *direct)
{
	ft_putstr_fd("cd: No such file or directory: ", STDERR);
	ft_putstr_fd(direct, STDERR);
	ft_putchar_fd('\n', STDERR);
	free (direct);
	return (1);
}
