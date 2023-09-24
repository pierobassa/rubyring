// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./Ownable.sol";

// TODO: Events, final pricing model,
/**
 * @title RubyRingV1
 * @dev This smart contract allows users to buy and sell gems related to a specific subject.
 * The contract has an inbuilt fee mechanism that can be set for both the protocol and the subject.
 *
 * The buying and selling price of gems is calculated using a summation formula based on the current supply.
 *
 * Inherits:
 *  - Ownable: This contract uses OpenZeppelin's Ownable for owner-only functions.
 */
contract RubyRingV1 is Ownable {
    address public protocolFeeDestination; // Destination address for protocol fees
    uint256 public protocolFeePercent; // Percentage fee for the protocol
    uint256 public subjectFeePercent; // Percentage fee for the subject of the gems

    /**
     * @dev Emitted when a trade occurs.
     * @param trader The address that executed the trade.
     * @param subject The address of the gems' subject.
     * @param isBuy True if the trade was a buy, false otherwise.
     * @param shareAmount The amount of gems traded.
     * @param ethAmount The ether amount without fees.
     * @param protocolEthAmount The ether amount taken as protocol fee.
     * @param subjectEthAmount The ether amount taken as subject fee.
     * @param supply The total supply after the trade.
     */
    event Trade(
        address trader,
        address subject,
        bool isBuy,
        uint256 shareAmount,
        uint256 ethAmount,
        uint256 protocolEthAmount,
        uint256 subjectEthAmount,
        uint256 supply
    );

    // gemsSubject => (Holder => Balance)
    mapping(address => mapping(address => uint256)) public gemsBalance;

    // gemsSubject => Supply
    mapping(address => uint256) public gemsSupply;

    // gemsSubject => generatedFees
    mapping(address => uint256) public generatedFees;

    /**
     * @dev Allows the owner to set the protocol fee destination address.
     * @param _feeDestination The new fee destination address.
     */
    function setFeeDestination(address _feeDestination) public onlyOwner {
        protocolFeeDestination = _feeDestination;
    }

    /**
     * @dev Allows the owner to set the protocol fee percentage.
     * @param _feePercent The new protocol fee percentage.
     */
    function setProtocolFeePercent(uint256 _feePercent) public onlyOwner {
        require(_feePercent < 1 ether, "Fee percent must be less than 100%");
        protocolFeePercent = _feePercent;
    }

    /**
     * @dev Allows the owner to set the subject fee percentage.
     * @param _feePercent The new subject fee percentage.
     */
    function setSubjectFeePercent(uint256 _feePercent) public onlyOwner {
        require(_feePercent < 1 ether, "Fee percent must be less than 100%");
        subjectFeePercent = _feePercent;
    }

    /**
     * @notice Calculates the price of buying or selling gems based on existing supply and desired amount.
     * @dev Implements a specific pricing curve based on the sum of squares. As the supply of gems grows,
     * the cost to purchase or redeem the next share increases.
     *
     * The formula used here is derived from the sum of squares,
     * which is: sum(n^2) = n(n + 1)(2n + 1)/6 for the first n squares.
     *
     * The function handles special edge cases when the supply is zero.
     *
     * Finally, the calculated price is scaled by a factor for appropriate denomination in ether.
     *
     * @param supply The current total number of gems.
     * @param amount The number of gems one wants to buy or sell.
     * @return The price for the specified amount of gems based on the current supply.
     */
    function getPrice(
        uint256 supply,
        uint256 amount
    ) public pure returns (uint256) {
        require(amount > 0, "Amount must be greater than zero");

        // If amount greater than 1 then supply must be greater than 0
        require(supply > 0 || amount == 1, "Supply must be greater than zero");

        uint256 sum1 = supply == 0
            ? 0
            : ((supply - 1) * (supply) * (2 * (supply - 1) + 1)) / 6;
        uint256 sum2 = supply == 0 && amount == 1
            ? 0
            : ((supply - 1 + amount) *
                (supply + amount) *
                (2 * (supply - 1 + amount) + 1)) / 6;
        uint256 summation = sum2 - sum1;
        return (summation * 1 ether) / 16000;
    }

    function getBuyPrice(
        address gemsSubject,
        uint256 amount
    ) public view returns (uint256) {
        return getPrice(gemsSupply[gemsSubject], amount);
    }

    function getSellPrice(
        address gemsSubject,
        uint256 amount
    ) public view returns (uint256) {
        return getPrice(gemsSupply[gemsSubject] - amount, amount);
    }

    function getBuyPriceAfterFee(
        address gemsSubject,
        uint256 amount
    ) public view returns (uint256) {
        uint256 price = getBuyPrice(gemsSubject, amount);
        uint256 protocolFee = (price * protocolFeePercent) / 1 ether;
        uint256 subjectFee = (price * subjectFeePercent) / 1 ether;
        return price + protocolFee + subjectFee;
    }

    function getSellPriceAfterFee(
        address gemsSubject,
        uint256 amount
    ) public view returns (uint256) {
        uint256 price = getSellPrice(gemsSubject, amount);
        uint256 protocolFee = (price * protocolFeePercent) / 1 ether;
        uint256 subjectFee = (price * subjectFeePercent) / 1 ether;
        return price - protocolFee - subjectFee;
    }

    /**
     * @notice Allows users to purchase gems of a given subject.
     * @param gemsSubject The address representing the gems subject.
     * @param amount The number of gems the user wants to buy.
     */
    function buyGems(address gemsSubject, uint256 amount) public payable {
        // Get the current total supply of gems for the subject.
        uint256 supply = gemsSupply[gemsSubject];

        // Ensure that the first share can only be bought by the subject itself.
        require(
            supply > 0 || gemsSubject == msg.sender,
            "Only the gems' subject can buy the first share"
        );

        // Calculate the cost of buying the specified number of gems.
        uint256 price = getPrice(supply, amount);

        // Compute the fee that goes to the protocol.
        uint256 protocolFee = (price * protocolFeePercent) / 1 ether;

        // Compute the fee that goes to the subject.
        uint256 subjectFee = (price * subjectFeePercent) / 1 ether;

        // Ensure that the sender has provided sufficient ether to cover the total cost.
        require(
            msg.value >= price + protocolFee + subjectFee,
            "Insufficient payment"
        );

        // Update the balance of gems for the buyer.
        gemsBalance[gemsSubject][msg.sender] =
            gemsBalance[gemsSubject][msg.sender] +
            amount;

        // Update the total supply of gems for the subject.
        gemsSupply[gemsSubject] = supply + amount;

        // Update the generated fees for the subject.
        generatedFees[gemsSubject] = generatedFees[gemsSubject] + subjectFee;

        // Emit a trade event for record-keeping and tracking.
        emit Trade(
            msg.sender,
            gemsSubject,
            true,
            amount,
            price,
            protocolFee,
            subjectFee,
            supply + amount
        );

        // Transfer the protocol fee to the designated protocol fee address.
        (bool success1, ) = protocolFeeDestination.call{ value: protocolFee }(
            ""
        );

        // Transfer the subject fee to the gems subject.
        (bool success2, ) = gemsSubject.call{ value: subjectFee }("");

        // Transfer the net amount after deducting fees back to the seller.
        (bool success3, ) = msg.sender.call{
            value: msg.value - price - protocolFee - subjectFee
        }("");

        // Ensure both transfers were successful.
        require(success1 && success2 && success3, "Unable to send funds");
    }

    /**
     * @notice Allows users to sell their gems of a given subject.
     * @param gemsSubject The address representing the gems subject.
     * @param amount The number of gems the user wants to sell.
     */
    function sellGems(address gemsSubject, uint256 amount) public payable {
        // Get the current total supply of gems for the subject.
        uint256 supply = gemsSupply[gemsSubject];

        // Ensure that the last share isn't sold.
        require(supply > amount, "Cannot sell the last share");

        // Calculate the redemption value for selling the specified number of gems.
        uint256 price = getPrice(supply - amount, amount);

        // Compute the fee that goes to the protocol.
        uint256 protocolFee = (price * protocolFeePercent) / 1 ether;

        // Compute the fee that goes to the subject.
        uint256 subjectFee = (price * subjectFeePercent) / 1 ether;

        // Ensure the seller has the specified amount of gems.
        require(
            gemsBalance[gemsSubject][msg.sender] >= amount,
            "Insufficient gems"
        );

        // Update the balance of gems for the seller.
        gemsBalance[gemsSubject][msg.sender] =
            gemsBalance[gemsSubject][msg.sender] -
            amount;

        // Update the total supply of gems for the subject.
        gemsSupply[gemsSubject] = supply - amount;

        // Update the generated fees for the subject.
        generatedFees[gemsSubject] = generatedFees[gemsSubject] + subjectFee;

        // Emit a trade event for record-keeping and tracking.
        emit Trade(
            msg.sender,
            gemsSubject,
            false,
            amount,
            price,
            protocolFee,
            subjectFee,
            supply - amount
        );

        // Transfer the net amount after deducting fees back to the seller.
        (bool success1, ) = msg.sender.call{
            value: price - protocolFee - subjectFee
        }("");

        // Transfer the protocol fee to the designated protocol fee address.
        (bool success2, ) = protocolFeeDestination.call{ value: protocolFee }(
            ""
        );

        // Transfer the subject fee to the gems subject.
        (bool success3, ) = gemsSubject.call{ value: subjectFee }("");

        // Ensure all transfers were successful.
        require(success1 && success2 && success3, "Unable to send funds");
    }
}
