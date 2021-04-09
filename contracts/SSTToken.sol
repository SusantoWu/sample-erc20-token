// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Susanto Token
 * @author Susanto Wu
 * @dev ERC20 token implementation
 */
contract SSTToken is Context, Ownable, ERC20 {
    mapping(address => bool) private _locked;

    constructor() Ownable() ERC20("Susanto", "SST") {
        _mint(_msgSender(), _amount(1000000));
    }

    /**
     * @dev Emitted when address lock or unlock.
     */
    event Lock(address indexed target, bool lock);

    /**
     * @dev Returns address lock status.
     */
    function locked(address target) public view returns (bool) {
        return _locked[target];
    }

    /**
     * @dev See {ERC20-transfer}.
     *
     * Override to provide decimal conversion.
     */
    function transfer(address recipient, uint256 value)
        public
        override
        returns (bool)
    {
        return super.transfer(recipient, _amount(value));
    }

    /**
     * @dev Add more token into `to` address.
     * Requirements:
     *
     * - only contract owner can mint.
     * @param to beneficiary address
     * @param value amount of token
     */
    function mint(address to, uint256 value) public onlyOwner {
        _mint(to, _amount(value));
    }

    /**
     * @dev Reduce token supply from caller.
     * Requirements:
     *
     * - only contract owner can burn.
     * @param value amount of token
     */
    function burn(uint256 value) public onlyOwner {
        _burn(_msgSender(), _amount(value));
    }

    /**
     * @dev Lock the target address to prevent transfer activity.
     * Requirements:
     *
     * - only contract owner can lock address.
     * @param target address to be lock
     * @param status lock or unlock
     */
    function lock(address target, bool status) public onlyOwner {
        require(
            target != address(0),
            "SSTToken: target address the zero address"
        );

        _locked[target] = status;

        emit Lock(target, status);
    }

    /**
     * @dev Calculate token smallest unit based on (18) decimals.
     * @param value amount of token
     * @return smallest unit
     */
    function _amount(uint256 value) private view returns (uint256) {
        return value * 10**decimals();
    }

    /**
     * @dev Override before transfer to check lock address.
     * Requirements:
     *
     * - `from` address must not lock
     * - `to` adddress must not lock.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20) {
        require(_locked[from] != true, "SSTToken: from address is locked");
        require(_locked[to] != true, "SSTToken: to address is locked");
        super._beforeTokenTransfer(from, to, amount);
    }
}
