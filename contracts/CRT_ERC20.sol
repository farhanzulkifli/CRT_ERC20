// // SPDX-License-Identifier: MIT
// // OpenZeppelin Contracts v4.4.1

pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CRT_ERC20 is ERC20PresetMinterPauser {
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    uint256 public timeCheck;
    uint256 public mintCap;

    constructor() ERC20PresetMinterPauser("ChickenRiceToken", "CRTERC20") {
        grantRole(BURNER_ROLE, msg.sender);
    }

    function burn(uint256 amount) public override onlyRole(BURNER_ROLE) {
        super._burn(msg.sender, amount);
    }

    function mint(address to, uint256 amount)
        public
        override
        onlyRole(MINTER_ROLE)
    {
        if (block.timestamp > timeCheck + 90 seconds) {
            require(
                amount * 10**decimals() <= 100 * 10**decimals(),
                "Maximum mint is 100CRT."
            );
            timeCheck = block.timestamp;
            mintCap = amount * 10**decimals();
            _mint(to, amount * 10**decimals());
        } else {
            require(
                (amount * 10**decimals() + mintCap) <= 100 * 10**decimals(),
                "(Amount intended + mint cap) exceeds 100CRT this epoch."
            );
            mintCap = amount * 10**decimals() + mintCap;
            _mint(to, amount * 10**decimals());
        }
    }

    function mintCheck() public view returns (string memory) {
        if (block.timestamp > timeCheck + 90 seconds) {
            return "100CRT left to mint for this epoch";
        } else {
            uint256 timeDifference = 90 - (block.timestamp - timeCheck);
            uint256 mintDifference = (100 * 10**decimals() - mintCap) /
                10**decimals();
            return
                string(
                    abi.encodePacked(
                        Strings.toString(mintDifference),
                        " CRT left to mint in ",
                        abi.encodePacked(Strings.toString(timeDifference)),
                        " seconds this epoch."
                    )
                );
        }
    }
}
