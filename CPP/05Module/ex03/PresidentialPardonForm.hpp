/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PresidentialPardonForm.hpp                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-05-27 12:37:03 by idvinov           #+#    #+#             */
/*   Updated: 2025-05-27 12:37:03 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef PFORM_HPP
#define PFORM_HPP

#include "AForm.hpp"

class PresidentialPardonForm : public AForm
{
private:
	std::string target;

public:
	PresidentialPardonForm();
	PresidentialPardonForm(std::string target);
	PresidentialPardonForm(const PresidentialPardonForm &instance);
	~PresidentialPardonForm();
	PresidentialPardonForm &operator=(const PresidentialPardonForm &instance);
	void Execute(Bureaucrat const &bureaucrat) const;
	std::string GetTarget() const;
};

std::ostream &operator<<(std::ostream &stream, const PresidentialPardonForm &instance);

#endif