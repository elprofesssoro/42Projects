/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   RobotomyRequestForm.hpp                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-05-27 12:37:03 by idvinov           #+#    #+#             */
/*   Updated: 2025-05-27 12:37:03 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef RFORM_HPP
#define RFORM_HPP

#include "AForm.hpp"

class RobotomyRequestForm : public AForm
{
private:
	std::string target;

public:
	RobotomyRequestForm();
	RobotomyRequestForm(std::string target);
	RobotomyRequestForm(const RobotomyRequestForm &instance);
	~RobotomyRequestForm();
	RobotomyRequestForm &operator=(const RobotomyRequestForm &instance);
	void Execute(Bureaucrat const &bureaucrat) const;
	std::string GetTarget() const;
};

std::ostream &operator<<(std::ostream &stream, const RobotomyRequestForm &instance);

#endif