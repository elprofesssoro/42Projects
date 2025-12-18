/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ShrubberyCreationForm.hpp                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-05-23 11:21:37 by idvinov           #+#    #+#             */
/*   Updated: 2025-05-23 11:21:37 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef SCFORM_HPP
#define SCFORM_HPP

#include <fstream>
#include "AForm.hpp"

class ShrubberyCreationForm : public AForm
{
private:
	std::string target;

public:
	ShrubberyCreationForm();
	ShrubberyCreationForm(std::string target);
	ShrubberyCreationForm(const ShrubberyCreationForm &instance);
	~ShrubberyCreationForm();
	ShrubberyCreationForm &operator=(const ShrubberyCreationForm &instance);
	void Execute(Bureaucrat const &bureaucrat) const;
	std::string GetTarget() const;
};

std::ostream &operator<<(std::ostream &stream, const ShrubberyCreationForm &instance);

#endif