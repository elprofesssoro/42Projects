/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Account.cpp                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-07 12:45:29 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-07 12:45:29 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/Account.hpp"
#include <iostream>
#include <ctime>

Account::Account(int initial_deposit)
{
	_displayTimestamp();
	_accountIndex = _nbAccounts;
	_nbAccounts++;
	_amount = initial_deposit;
	_totalAmount += _amount;
	_nbDeposits = 0;
	_nbWithdrawals = 0;
	std::cout << "index:" << _accountIndex << ";amount:" << _amount << ";created\n"; 
}

Account::~Account()
{
	_displayTimestamp();
	_nbAccounts--;
	_totalAmount -= _amount;

	std::cout << "index:" << _accountIndex << ";amount:" << _amount << ";closed\n"; 
}

int Account::getNbAccounts(void)
{
	return _nbAccounts;
}
int Account::getTotalAmount(void)
{
	return _totalAmount;
}
int Account::getNbDeposits(void)
{
	return _totalNbDeposits;
}
int Account::getNbWithdrawals(void)
{
	return _totalNbWithdrawals;
}

void Account::displayAccountsInfos(void){
	_displayTimestamp();
	std::cout << "accounts:" << _nbAccounts << ";total:" << _totalAmount 
			  << ";deposits:" << _totalNbDeposits << ";withdrawals:" << _totalNbWithdrawals <<'\n';
}

void	Account::makeDeposit( int deposit )
{
	_displayTimestamp();
	_nbDeposits++;
	_totalNbDeposits++;
	std::cout << "index:" << _accountIndex << ";p_amount:" << _amount << ";deposit:" << deposit 
			  << ";amount:" << _amount + deposit << ";nb_deposits:" << _nbDeposits << '\n';
	_amount += deposit;
	_totalAmount += deposit;
}
bool	Account::makeWithdrawal( int withdrawal )
{
	_displayTimestamp();
	std::cout << "index:" << _accountIndex << ";p_amount:" << _amount;
	if(_amount - withdrawal < 0)
	{
		std::cout << ";withdrawal:refused\n";
		return false;
	}
	
	_totalNbWithdrawals++;
	_nbWithdrawals++;
	std::cout << ";withdrawal:" << withdrawal << ";amount:" << _amount - withdrawal 
			  << ";nb_withdrawals:" << _nbWithdrawals << '\n';
	_amount -= withdrawal;
	_totalAmount -= withdrawal;
	return true;
}
int		Account::checkAmount( void ) const
{
	return _amount;
}
void	Account::displayStatus( void ) const
{
	_displayTimestamp();
	std::cout << "index:" << _accountIndex << ";amount:" << _amount << ";deposits:" << _nbDeposits 
			  << ";withdrawals:" << _nbWithdrawals << '\n';
}

void    Account::_displayTimestamp( void )
{
    std::time_t current_time = std::time(0);
    std::tm* localTime = std::localtime(&current_time);
    std::cout <<
    "[" <<
    (localTime->tm_year + 1900) <<
    "0" << (localTime->tm_mon + 1) <<
    "0" << localTime->tm_mday <<
    "_" <<
    localTime->tm_hour <<
    localTime->tm_min <<
    localTime->tm_sec <<
    "] " ;
}

int	Account::_nbAccounts = 0;
int	Account::_totalAmount = 0;
int	Account::_totalNbDeposits = 0;
int	Account::_totalNbWithdrawals = 0;